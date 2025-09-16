/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from '../entities/file-upload.entity';
import { UploadFileDto, FileUploadResponseDto } from '../dto/file-upload.dto';

/**
 * 文件上传服务
 * 提供文件的上传、查询、下载和删除等功能
 */
@Injectable()
export class FileUploadService {
  constructor(
    @InjectRepository(FileUpload)
    private fileUploadRepository: Repository<FileUpload>,
  ) {}

  /**
   * 上传文件到数据库
   * @param file Express文件对象
   * @param uploadFileDto 上传文件DTO
   * @param userId 用户ID
   * @returns 上传的文件信息
   */
  async uploadFile(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
    userId: string,
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('文件不能为空');
    }

    // 创建文件实体
    const fileUpload = this.fileUploadRepository.create({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size, // 使用number类型，与实体定义保持一致
      data: file.buffer,
      userId,
      documentId: uploadFileDto.documentId,
      description: uploadFileDto.description,
    });

    // 保存文件到数据库
    const savedFile = await this.fileUploadRepository.save(fileUpload);

    // 返回文件信息（不包含二进制数据）
    return this.mapToResponseDto(savedFile);
  }

  /**
   * 获取用户的所有文件
   * @param userId 用户ID
   * @returns 文件列表
   */
  async getUserFiles(userId: string): Promise<FileUploadResponseDto[]> {
    const files = await this.fileUploadRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return files.map((file) => this.mapToResponseDto(file));
  }

  /**
   * 获取单个文件信息
   * @param id 文件ID
   * @param userId 用户ID
   * @returns 文件信息
   */
  async getFileInfo(
    id: string,
    userId: string,
  ): Promise<FileUploadResponseDto> {
    const file = await this.fileUploadRepository.findOneBy({ id, userId });

    if (!file) {
      throw new NotFoundException('文件不存在或无权访问');
    }

    return this.mapToResponseDto(file);
  }

  /**
   * 获取文件内容（用于下载）
   * @param id 文件ID
   * @param userId 用户ID
   * @returns 文件内容及元数据
   */
  async getFileContent(
    id: string,
    userId: string,
  ): Promise<{
    file: FileUpload;
    stream: Buffer;
  }> {
    const file = await this.fileUploadRepository.findOneBy({ id, userId });

    if (!file) {
      throw new NotFoundException('文件不存在或无权访问');
    }

    return {
      file,
      stream: file.data,
    };
  }

  /**
   * 删除文件
   * @param id 文件ID
   * @param userId 用户ID
   * @returns 删除状态
   */
  async deleteFile(id: string, userId: string): Promise<{ deleted: boolean }> {
    const file = await this.fileUploadRepository.findOneBy({ id, userId });

    if (!file) {
      throw new NotFoundException('文件不存在或无权访问');
    }

    await this.fileUploadRepository.remove(file);

    return { deleted: true };
  }

  /**
   * 将文件实体映射为响应DTO
   * @param fileUpload 文件上传实体
   * @returns 文件上传响应DTO
   */
  private mapToResponseDto(fileUpload: FileUpload): FileUploadResponseDto {
    const {
      id,
      filename,
      mimetype,
      size,
      userId,
      documentId,
      description,
      createdAt,
      updatedAt,
    } = fileUpload;
    return {
      id,
      filename,
      mimetype,
      size,
      userId,
      documentId,
      description,
      createdAt,
      updatedAt,
    };
  }
}
