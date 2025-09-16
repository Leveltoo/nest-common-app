import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

/**
 * 文件上传请求DTO
 * 用于文件上传请求的数据验证
 */
export class UploadFileDto {
  @ApiPropertyOptional({
    description: '文件描述',
    example: '项目需求文档',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '关联的文档ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsOptional()
  @IsUUID()
  documentId?: string;
}

/**
 * 文件上传响应DTO
 * 用于文件上传响应的数据格式化
 */
export class FileUploadResponseDto {
  @ApiProperty({
    description: '文件唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  id: string;

  @ApiProperty({
    description: '文件名',
    example: 'my-document.pdf',
  })
  filename: string;

  @ApiProperty({
    description: '文件类型',
    example: 'application/pdf',
  })
  mimetype: string;

  @ApiProperty({
    description: '文件大小（字节）',
    example: 102400,
  })
  size: number;

  @ApiProperty({
    description: '上传者ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  userId: string;

  @ApiPropertyOptional({
    description: '关联的文档ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  documentId?: string;

  @ApiPropertyOptional({
    description: '文件描述',
    example: '项目需求文档',
  })
  description?: string;

  @ApiProperty({
    description: '创建时间',
    example: '2024-05-01T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2024-05-01T10:00:00Z',
  })
  updatedAt: Date;
}
