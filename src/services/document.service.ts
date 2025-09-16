import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
import { DocumentVersion } from '../entities/document-version.entity';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentResponseDto,
  DocumentVersionDto,
  RestoreDocumentDto,
  DocumentVersionsQueryDto,
} from '../dto/document.dto';

/**
 * 文档服务
 * 提供文档的CRUD操作和其他文档管理功能
 */
@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(DocumentVersion)
    private documentVersionRepository: Repository<DocumentVersion>,
  ) {}

  /**
   * 创建新文档
   * @param createDocumentDto 文档创建数据
   * @param userId 创建者ID
   * @returns 创建的文档信息
   */
  async createDocument(
    createDocumentDto: CreateDocumentDto,
    userId: string,
  ): Promise<DocumentResponseDto> {
    const document = this.documentRepository.create({
      ...createDocumentDto,
      userId,
    });

    await this.documentRepository.save(document);

    // 创建初始版本
    await this.createDocumentVersion(document, userId, '文档创建');

    return this.mapToDocumentResponse(document);
  }

  /**
   * 获取用户的所有文档
   * @param userId 用户ID
   * @returns 用户的所有文档列表
   */
  async getUserDocuments(userId: string): Promise<DocumentResponseDto[]> {
    const documents = await this.documentRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });

    return documents.map((doc) => this.mapToDocumentResponse(doc));
  }

  /**
   * 获取单个文档
   * @param id 文档ID
   * @param userId 用户ID
   * @returns 文档详细信息
   */
  async getDocument(id: string, userId: string): Promise<DocumentResponseDto> {
    const document = await this.documentRepository.findOneBy({ id });

    if (!document) {
      throw new NotFoundException('文档不存在');
    }

    // 检查用户是否有权限访问文档
    if (document.userId !== userId && document.access !== 'public') {
      throw new UnauthorizedException('无权限访问此文档');
    }

    return this.mapToDocumentResponse(document);
  }

  /**
   * 更新文档
   * @param id 文档ID
   * @param updateDocumentDto 文档更新数据
   * @param userId 用户ID
   * @param changeDescription 变更说明
   * @returns 更新后的文档信息
   */
  async updateDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    userId: string,
    changeDescription?: string,
  ): Promise<DocumentResponseDto> {
    const document = await this.documentRepository.findOneBy({ id });

    if (!document) {
      throw new NotFoundException('文档不存在');
    }

    // 检查用户是否有权限更新文档
    if (document.userId !== userId) {
      throw new UnauthorizedException('无权限更新此文档');
    }

    // 检查是否有内容变更，如果有则创建新版本
    const hasContentChange =
      updateDocumentDto.content !== document.content ||
      updateDocumentDto.title !== document.title ||
      updateDocumentDto.type !== document.type;

    if (hasContentChange) {
      await this.createDocumentVersion(
        document,
        userId,
        changeDescription || '文档更新',
      );
    }

    // 更新文档信息
    Object.assign(document, updateDocumentDto);
    await this.documentRepository.save(document);

    return this.mapToDocumentResponse(document);
  }

  /**
   * 删除文档
   * @param id 文档ID
   * @param userId 用户ID
   * @returns 删除状态
   */
  async deleteDocument(
    id: string,
    userId: string,
  ): Promise<{ deleted: boolean }> {
    const document = await this.documentRepository.findOneBy({ id });

    if (!document) {
      throw new NotFoundException('文档不存在');
    }

    // 检查用户是否有权限删除文档
    if (document.userId !== userId) {
      throw new UnauthorizedException('无权限删除此文档');
    }

    await this.documentRepository.delete(id);

    return { deleted: true };
  }

  /**
   * 创建文档版本
   * @param document 文档实体
   * @param modifiedBy 修改人ID
   * @param changeDescription 变更说明
   * @returns 创建的文档版本
   */
  async createDocumentVersion(
    document: Document,
    modifiedBy: string,
    changeDescription?: string,
  ): Promise<DocumentVersion> {
    const newVersion = this.documentVersionRepository.create({
      document,
      documentId: document.id,
      versionNumber: document.currentVersion + 1,
      content: document.content,
      title: document.title,
      type: document.type,
      modifiedBy,
      changeDescription,
    });

    await this.documentVersionRepository.save(newVersion);

    // 更新文档当前版本号
    document.currentVersion = newVersion.versionNumber;
    await this.documentRepository.save(document);

    // 清理旧版本，只保留最近100条
    await this.cleanupOldVersions(document.id);

    return newVersion;
  }

  /**
   * 获取文档的所有版本（分页）
   * @param documentId 文档ID
   * @param userId 用户ID
   * @param query 查询参数
   * @returns 版本列表
   */
  async getDocumentVersions(
    documentId: string,
    userId: string,
    query: DocumentVersionsQueryDto,
  ): Promise<{ data: DocumentVersionDto[]; total: number }> {
    // 验证用户权限
    const document = await this.documentRepository.findOneBy({
      id: documentId,
    });
    if (!document) {
      throw new NotFoundException('文档不存在');
    }

    if (document.userId !== userId && document.access !== 'public') {
      throw new UnauthorizedException('无权限访问此文档');
    }

    // 构建查询条件
    const { page = 1, pageSize = 10, modifiedBy } = query;
    const skip = (page - 1) * pageSize;

    const where = { documentId };
    if (modifiedBy) {
      (where as any).modifiedBy = modifiedBy;
    }

    // 查询版本列表和总数
    const [versions, total] = await this.documentVersionRepository.findAndCount(
      {
        where,
        order: { versionNumber: 'DESC' },
        take: pageSize,
        skip,
      },
    );

    return {
      data: versions.map((version) => this.mapToDocumentVersionDto(version)),
      total,
    };
  }

  /**
   * 获取特定版本的文档内容
   * @param documentId 文档ID
   * @param versionNumber 版本号
   * @param userId 用户ID
   * @returns 指定版本的文档内容
   */
  async getDocumentByVersion(
    documentId: string,
    versionNumber: number,
    userId: string,
  ): Promise<DocumentVersion> {
    // 验证用户权限
    const document = await this.documentRepository.findOneBy({
      id: documentId,
    });
    if (!document) {
      throw new NotFoundException('文档不存在');
    }

    if (document.userId !== userId && document.access !== 'public') {
      throw new UnauthorizedException('无权限访问此文档');
    }

    const version = await this.documentVersionRepository.findOne({
      where: { documentId, versionNumber },
    });

    if (!version) {
      throw new NotFoundException('该版本不存在');
    }

    return version;
  }

  /**
   * 恢复文档到指定版本
   * @param documentId 文档ID
   * @param restoreDto 恢复参数
   * @param userId 用户ID
   * @returns 恢复后的文档
   */
  async restoreDocumentToVersion(
    documentId: string,
    restoreDto: RestoreDocumentDto,
    userId: string,
  ): Promise<DocumentResponseDto> {
    const { versionNumber, changeDescription } = restoreDto;

    // 验证用户权限
    const document = await this.documentRepository.findOneBy({
      id: documentId,
    });
    if (!document) {
      throw new NotFoundException('文档不存在');
    }

    if (document.userId !== userId) {
      throw new UnauthorizedException('无权限更新此文档');
    }

    // 获取要恢复到的版本
    const version = await this.getDocumentByVersion(
      documentId,
      versionNumber,
      userId,
    );

    // 保存当前状态为新版本
    await this.createDocumentVersion(
      document,
      userId,
      changeDescription || `恢复到版本 ${versionNumber}`,
    );

    // 恢复内容
    document.content = version.content;
    document.title = version.title;
    document.type = version.type;

    await this.documentRepository.save(document);

    return this.mapToDocumentResponse(document);
  }

  /**
   * 清理旧版本，只保留最近100条
   * @param documentId 文档ID
   */
  private async cleanupOldVersions(documentId: string): Promise<void> {
    const MAX_VERSIONS = 100;

    // 查询总版本数
    const total = await this.documentVersionRepository.count({
      where: { documentId },
    });

    if (total > MAX_VERSIONS) {
      // 计算需要删除的版本数量
      const versionsToDelete = total - MAX_VERSIONS;

      // 查询最旧的版本
      const oldVersions = await this.documentVersionRepository.find({
        where: { documentId },
        order: { versionNumber: 'ASC' },
        take: versionsToDelete,
      });

      // 删除旧版本
      if (oldVersions.length > 0) {
        await this.documentVersionRepository.remove(oldVersions);
      }
    }
  }

  /**
   * 将文档实体映射为文档响应DTO
   * @param document 文档实体
   * @returns 文档响应DTO
   */
  private mapToDocumentResponse(document: Document): DocumentResponseDto {
    const {
      id,
      title,
      content,
      type,
      userId,
      status,
      access,
      createdAt,
      updatedAt,
      currentVersion,
    } = document;
    return {
      id,
      title,
      content,
      type,
      userId,
      status,
      access,
      createdAt,
      updatedAt,
      currentVersion,
    };
  }

  /**
   * 将文档版本实体映射为文档版本响应DTO
   * @param version 文档版本实体
   * @returns 文档版本响应DTO
   */
  private mapToDocumentVersionDto(
    version: DocumentVersion,
  ): DocumentVersionDto {
    const {
      id,
      documentId,
      versionNumber,
      title,
      type,
      modifiedBy,
      changeDescription,
      createdAt,
    } = version;
    return {
      id,
      documentId,
      versionNumber,
      title,
      type,
      modifiedBy,
      changeDescription,
      createdAt,
    };
  }
}
