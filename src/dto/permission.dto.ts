import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建权限DTO
 * 用于创建权限请求的数据验证
 */
export class CreatePermissionDto {
  @ApiProperty({
    description: '权限名称',
    example: '用户管理',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '权限码',
    example: 'user:manage',
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: '权限描述',
    example: '管理系统用户的权限',
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
 * 更新权限DTO
 * 用于更新权限请求的数据验证
 */
export class UpdatePermissionDto {
  @ApiProperty({
    description: '权限名称',
    example: '用户管理',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '权限码',
    example: 'user:manage',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: '权限描述',
    example: '管理系统用户的权限',
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
 * 权限响应DTO
 * 用于返回权限信息的数据结构
 */
export class PermissionResponseDto {
  @ApiProperty({
    description: '权限唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: '权限名称',
    example: '用户管理',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '权限码',
    example: 'user:manage',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: '权限描述',
    example: '管理系统用户的权限',
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
