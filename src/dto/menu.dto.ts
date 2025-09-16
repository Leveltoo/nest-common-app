import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 创建菜单DTO
 * 用于创建菜单请求的数据验证
 */
export class CreateMenuDto {
  @ApiProperty({
    description: '菜单名称',
    example: '用户管理',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: '菜单路径',
    example: '/users',
    required: true,
  })
  @IsString()
  path: string;

  @ApiProperty({
    description: '菜单组件路径',
    example: 'UserManagement',
    required: true,
  })
  @IsString()
  component: string;

  @ApiProperty({
    description: '菜单图标',
    example: 'user',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: '父菜单ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({
    description: '菜单排序',
    example: 1,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiProperty({
    description: '菜单类型',
    example: 'menu',
    enum: ['menu', 'button', 'link'],
    default: 'menu',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['menu', 'button', 'link'])
  type?: string;

  @ApiProperty({
    description: '权限码',
    example: 'user:manage',
    required: false,
  })
  @IsOptional()
  @IsString()
  permissionCode?: string;

  @ApiProperty({
    description: '是否显示在菜单中',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  show?: boolean;

  @ApiProperty({
    description: '是否启用',
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({
    description: '可访问此菜单的用户角色列表',
    example: ['admin', 'user'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}

/**
 * 更新菜单DTO
 * 用于更新菜单请求的数据验证
 */
export class UpdateMenuDto {
  @ApiProperty({
    description: '菜单名称',
    example: '用户管理',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '菜单路径',
    example: '/users',
    required: false,
  })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiProperty({
    description: '菜单组件路径',
    example: 'UserManagement',
    required: false,
  })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiProperty({
    description: '菜单图标',
    example: 'user',
    required: false,
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: '父菜单ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiProperty({
    description: '菜单排序',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiProperty({
    description: '菜单类型',
    example: 'menu',
    enum: ['menu', 'button', 'link'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEnum(['menu', 'button', 'link'])
  type?: string;

  @ApiProperty({
    description: '权限码',
    example: 'user:manage',
    required: false,
  })
  @IsOptional()
  @IsString()
  permissionCode?: string;

  @ApiProperty({
    description: '是否显示在菜单中',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  show?: boolean;

  @ApiProperty({
    description: '是否启用',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({
    description: '可访问此菜单的用户角色列表',
    example: ['admin', 'user'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}

/**
 * 菜单响应DTO
 * 用于返回菜单信息的数据结构
 */
export class MenuResponseDto {
  @ApiProperty({
    description: '菜单唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  id: string;

  @ApiProperty({
    description: '菜单名称',
    example: '用户管理',
  })
  name: string;

  @ApiProperty({
    description: '菜单路径',
    example: '/users',
  })
  path: string;

  @ApiProperty({
    description: '菜单组件路径',
    example: 'UserManagement',
  })
  component: string;

  @ApiProperty({
    description: '菜单图标',
    example: 'user',
  })
  icon?: string;

  @ApiProperty({
    description: '父菜单ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  parentId?: string;

  @ApiProperty({
    description: '菜单排序',
    example: 1,
  })
  sort?: number;

  @ApiProperty({
    description: '菜单类型',
    example: 'menu',
  })
  type?: string;

  @ApiProperty({
    description: '权限码',
    example: 'user:manage',
  })
  permissionCode?: string;

  @ApiProperty({
    description: '是否显示在菜单中',
    example: true,
  })
  show: boolean;

  @ApiProperty({
    description: '是否启用',
    example: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: '可访问此菜单的用户角色列表',
    example: ['admin', 'user'],
    type: [String],
  })
  roles: string[];

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
