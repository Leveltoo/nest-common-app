import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建字典DTO
 * 用于创建字典请求的数据验证
 */
export class CreateDictionaryDto {
  @ApiProperty({
    description: '字典名称',
    example: '用户状态',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '字典编码',
    example: 'USER_STATUS',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: '字典描述',
    example: '用户状态字典',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '是否启用',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean = true;
}

/**
 * 更新字典DTO
 * 用于更新字典请求的数据验证
 */
export class UpdateDictionaryDto {
  @ApiProperty({
    description: '字典名称',
    example: '用户状态',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '字典编码',
    example: 'USER_STATUS',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: '字典描述',
    example: '用户状态字典',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '是否启用',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

/**
 * 字典响应DTO
 * 用于返回字典信息的数据结构
 */
export class DictionaryResponseDto {
  @ApiProperty({
    description: '字典唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: '字典名称',
    example: '用户状态',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '字典编码',
    example: 'USER_STATUS',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: '字典描述',
    example: '用户状态字典',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '是否启用',
    example: true,
  })
  @IsBoolean()
  enabled: boolean;

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

/**
 * 创建字典项DTO
 * 用于创建字典项请求的数据验证
 */
export class CreateDictionaryItemDto {
  @ApiProperty({
    description: '字典ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    required: true,
  })
  @IsUUID()
  dictionaryId: string;

  @ApiProperty({
    description: '字典项值',
    example: '1',
    required: true,
  })
  @IsString()
  value: string;

  @ApiProperty({
    description: '字典项标签',
    example: '启用',
    required: true,
  })
  @IsString()
  label: string;

  @ApiProperty({
    description: '排序',
    example: 1,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sort?: number = 0;

  @ApiProperty({
    description: '是否启用',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean = true;

  @ApiProperty({
    description: '扩展信息',
    example: '{"color": "green"}',
    required: false,
  })
  @IsOptional()
  @IsObject()
  extra?: Record<string, any>;
}

/**
 * 更新字典项DTO
 * 用于更新字典项请求的数据验证
 */
export class UpdateDictionaryItemDto {
  @ApiProperty({
    description: '字典项值',
    example: '1',
    required: false,
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiProperty({
    description: '字典项标签',
    example: '启用',
    required: false,
  })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({
    description: '排序',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiProperty({
    description: '是否启用',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({
    description: '扩展信息',
    example: '{"color": "green"}',
    required: false,
  })
  @IsOptional()
  @IsObject()
  extra?: Record<string, any>;
}

/**
 * 字典项响应DTO
 * 用于返回字典项信息的数据结构
 */
export class DictionaryItemResponseDto {
  @ApiProperty({
    description: '字典项唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: '字典信息',
    type: () => DictionaryResponseDto,
  })
  dictionary: DictionaryResponseDto;

  @ApiProperty({
    description: '字典项值',
    example: '1',
  })
  @IsString()
  value: string;

  @ApiProperty({
    description: '字典项标签',
    example: '启用',
  })
  @IsString()
  label: string;

  @ApiProperty({
    description: '排序',
    example: 1,
  })
  @IsNumber()
  sort: number;

  @ApiProperty({
    description: '是否启用',
    example: true,
  })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    description: '扩展信息',
    example: '{"color": "green"}',
    required: false,
  })
  @IsOptional()
  @IsObject()
  extra?: Record<string, any>;

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
