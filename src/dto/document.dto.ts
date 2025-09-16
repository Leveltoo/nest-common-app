import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建文档DTO
 * 用于创建文档请求的数据验证
 */
export class CreateDocumentDto {
  @ApiProperty({
    description: '文档标题',
    example: '我的第一篇文档',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '文档内容',
    example: '这是文档的内容...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: '文档类型',
    example: 'text',
    default: 'text',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: '文档状态',
    example: 'draft',
    enum: ['draft', 'published'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['draft', 'published'])
  status?: string;

  @ApiProperty({
    description: '访问权限',
    example: 'private',
    enum: ['private', 'public', 'shared'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['private', 'public', 'shared'])
  access?: string;
}

/**
 * 更新文档DTO
 * 用于更新文档请求的数据验证
 */
export class UpdateDocumentDto {
  @ApiProperty({
    description: '文档标题',
    example: '更新后的文档标题',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: '文档内容',
    example: '更新后的文档内容...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: '文档类型',
    example: 'text',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: '文档状态',
    example: 'published',
    enum: ['draft', 'published'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['draft', 'published'])
  status?: string;

  @ApiProperty({
    description: '访问权限',
    example: 'shared',
    enum: ['private', 'public', 'shared'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['private', 'public', 'shared'])
  access?: string;
}

/**
 * 文档响应DTO
 * 用于文档信息响应的数据格式
 */
export class DocumentResponseDto {
  id: string;
  title: string;
  content?: string;
  type: string;
  userId: string;
  status: string;
  access: string;
  createdAt: Date;
  updatedAt: Date;
  currentVersion: number;
}

/**
 * 文档版本DTO
 * 用于文档版本信息响应的数据格式
 */
export class DocumentVersionDto {
  id: string;
  documentId: string;
  versionNumber: number;
  title?: string;
  type?: string;
  modifiedBy: string;
  changeDescription?: string;
  createdAt: Date;
}

/**
 * 恢复文档DTO
 * 用于恢复文档到指定版本的数据验证
 */
export class RestoreDocumentDto {
  @ApiProperty({
    description: '要恢复到的版本号',
    example: 2,
    required: true,
  })
  @IsNumber()
  versionNumber: number;

  @ApiProperty({
    description: '恢复说明',
    example: '恢复到之前的版本',
    required: false,
  })
  @IsOptional()
  @IsString()
  changeDescription?: string;
}

/**
 * 文档版本列表查询DTO
 * 用于分页查询文档版本的数据验证
 */
export class DocumentVersionsQueryDto {
  @ApiProperty({
    description: '页码',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  pageSize?: number = 10;

  @ApiProperty({
    description: '操作用户ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    required: false,
  })
  @IsOptional()
  @IsString()
  modifiedBy?: string;
}
