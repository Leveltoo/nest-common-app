import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { DocumentService } from '../services/document.service';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentResponseDto,
  DocumentVersionDto,
  RestoreDocumentDto,
  DocumentVersionsQueryDto,
} from '../dto/document.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

/**
 * 文档控制器
 * 处理文档的CRUD操作相关的HTTP请求
 */
@ApiTags('文档管理')
@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * 创建新文档
   * @param createDocumentDto 文档创建数据
   * @param req HTTP请求对象
   * @returns 创建的文档信息
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '创建文档',
    description: '创建一个新的文档',
  })
  @ApiResponse({
    status: 201,
    description: '文档创建成功',
    type: DocumentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '输入数据无效',
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要有效的JWT令牌',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async createDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @Req() req: Request,
  ): Promise<DocumentResponseDto> {
    const userId = req.user.sub;
    return this.documentService.createDocument(createDocumentDto, userId);
  }

  /**
   * 获取用户的所有文档
   * @param req HTTP请求对象
   * @returns 用户的所有文档列表
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取所有文档',
    description: '获取当前用户的所有文档列表',
  })
  @ApiResponse({
    status: 200,
    description: '文档列表获取成功',
    type: [DocumentResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要有效的JWT令牌',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserDocuments(@Req() req: Request): Promise<DocumentResponseDto[]> {
    const userId = req.user.sub;
    return this.documentService.getUserDocuments(userId);
  }

  /**
   * 获取单个文档
   * @param id 文档ID
   * @param req HTTP请求对象
   * @returns 文档详细信息
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取单个文档',
    description: '根据ID获取文档的详细信息',
  })
  @ApiParam({
    name: 'id',
    description: '文档唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '文档获取成功',
    type: DocumentResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要有效的JWT令牌',
  })
  @ApiResponse({
    status: 404,
    description: '文档不存在或无权访问',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getDocument(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<DocumentResponseDto> {
    const userId = req.user.sub;
    return this.documentService.getDocument(id, userId);
  }

  /**
   * 更新文档
   * @param id 文档ID
   * @param updateDocumentDto 文档更新数据
   * @param req HTTP请求对象
   * @returns 更新后的文档信息
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '更新文档',
    description: '更新指定文档的内容和属性',
  })
  @ApiParam({
    name: 'id',
    description: '文档唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '文档更新成功',
    type: DocumentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '输入数据无效',
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要有效的JWT令牌',
  })
  @ApiResponse({
    status: 404,
    description: '文档不存在或无权访问',
  })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateDocument(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Req() req: Request,
  ): Promise<DocumentResponseDto> {
    const userId = req.user.sub;
    // 从请求体中提取变更说明
    const changeDescription = (req.body as any).changeDescription;
    return this.documentService.updateDocument(
      id,
      updateDocumentDto,
      userId,
      changeDescription,
    );
  }

  /**
   * 获取文档版本列表
   * @param documentId 文档ID
   * @param query 查询参数
   * @param req HTTP请求对象
   * @returns 版本列表
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取文档版本列表',
    description: '获取指定文档的所有版本历史记录',
  })
  @ApiParam({
    name: 'documentId',
    description: '文档唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '版本列表获取成功',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/DocumentVersionDto',
          },
        },
        total: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '文档不存在' })
  @Get(':documentId/versions')
  @UseGuards(JwtAuthGuard)
  async getDocumentVersions(
    @Param('documentId') documentId: string,
    @Query() query: DocumentVersionsQueryDto,
    @Req() req: Request,
  ) {
    const userId = req.user.sub;
    return this.documentService.getDocumentVersions(documentId, userId, query);
  }

  /**
   * 获取特定版本的文档内容
   * @param documentId 文档ID
   * @param versionNumber 版本号
   * @param req HTTP请求对象
   * @returns 指定版本的文档内容
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取特定版本的文档内容',
    description: '获取指定文档的特定版本的详细内容',
  })
  @ApiParam({
    name: 'documentId',
    description: '文档唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiParam({
    name: 'versionNumber',
    description: '版本号',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: '版本获取成功',
    type: DocumentVersionDto,
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '文档或版本不存在' })
  @Get(':documentId/versions/:versionNumber')
  @UseGuards(JwtAuthGuard)
  async getDocumentByVersion(
    @Param('documentId') documentId: string,
    @Param('versionNumber') versionNumber: number,
    @Req() req: Request,
  ): Promise<DocumentVersionDto> {
    const userId = req.user.sub;
    const version = await this.documentService.getDocumentByVersion(
      documentId,
      versionNumber,
      userId,
    );
    // 直接返回version对象
    return version;
  }

  /**
   * 恢复文档到指定版本
   * @param documentId 文档ID
   * @param restoreDto 恢复参数
   * @param req HTTP请求对象
   * @returns 恢复后的文档
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '恢复文档到指定版本',
    description: '将文档恢复到指定的历史版本',
  })
  @ApiParam({
    name: 'documentId',
    description: '文档唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '文档恢复成功',
    type: DocumentResponseDto,
  })
  @ApiResponse({ status: 400, description: '输入数据无效' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '文档或版本不存在' })
  @Put(':documentId/restore')
  @UseGuards(JwtAuthGuard)
  async restoreDocumentToVersion(
    @Param('documentId') documentId: string,
    @Body() restoreDto: RestoreDocumentDto,
    @Req() req: Request,
  ): Promise<DocumentResponseDto> {
    const userId = req.user.sub;
    return this.documentService.restoreDocumentToVersion(
      documentId,
      restoreDto,
      userId,
    );
  }

  /**
   * 删除文档
   * @param id 文档ID
   * @param req HTTP请求对象
   * @returns 删除状态
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '删除文档',
    description: '删除指定的文档',
  })
  @ApiParam({
    name: 'id',
    description: '文档唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '文档删除成功',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要有效的JWT令牌',
  })
  @ApiResponse({
    status: 404,
    description: '文档不存在或无权访问',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteDocument(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<{ deleted: boolean }> {
    const userId = req.user.sub;
    return this.documentService.deleteDocument(id, userId);
  }
}
