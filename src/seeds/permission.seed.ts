import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';

/**
 * 权限种子数据服务
 * 提供初始化权限数据的功能，确保与默认角色ID保持一致
 */
@Injectable()
export class PermissionSeed {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * 初始化权限数据
   * 检查是否已有权限数据，如果没有则插入基础权限
   */
  async run(): Promise<void> {
    // 检查是否已有权限数据
    const count = await this.permissionRepository.count();
    if (count > 0) {
      console.log('权限数据已存在，跳过初始化');
      return;
    }

    console.log('开始初始化权限数据...');

    // 基础权限数据，与默认角色ID保持一致
    const permissions: Partial<Permission>[] = [
      // Super Admin 权限 (ID: 0)
      {
        id: '0',
        name: '超级管理员权限',
        code: 'super_admin',
        description: '系统最高权限，拥有所有操作权限',
        enabled: true,
      },
      // Admin 权限 (ID: 1)
      {
        id: '1',
        name: '管理员权限',
        code: 'admin',
        description: '系统管理员权限，拥有大部分管理功能',
        enabled: true,
      },
      // User 权限 (ID: 2)
      {
        id: '2',
        name: '用户权限',
        code: 'user',
        description: '普通用户权限，拥有基础操作功能',
        enabled: true,
      },
      // 系统管理相关权限
      {
        id: '3',
        name: '用户管理',
        code: 'user:manage',
        description: '管理系统用户的权限',
        enabled: true,
      },
      {
        id: '4',
        name: '菜单管理',
        code: 'menu:manage',
        description: '管理系统菜单的权限',
        enabled: true,
      },
      {
        id: '5',
        name: '权限管理',
        code: 'permission:manage',
        description: '管理系统权限的权限',
        enabled: true,
      },
      // 文档相关权限
      {
        id: '6',
        name: '文档创建',
        code: 'document:create',
        description: '创建文档的权限',
        enabled: true,
      },
      {
        id: '7',
        name: '文档查看',
        code: 'document:view',
        description: '查看文档的权限',
        enabled: true,
      },
      {
        id: '8',
        name: '文档编辑',
        code: 'document:edit',
        description: '编辑文档的权限',
        enabled: true,
      },
      {
        id: '9',
        name: '文档删除',
        code: 'document:delete',
        description: '删除文档的权限',
        enabled: true,
      },
      // 字典相关权限
      {
        id: '10',
        name: '字典管理',
        code: 'dictionary:manage',
        description: '管理系统字典的权限',
        enabled: true,
      },
    ];

    // 插入权限数据
    await this.permissionRepository.save(permissions);

    console.log(`成功初始化 ${permissions.length} 条权限数据`);
  }
}
