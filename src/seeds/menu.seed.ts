import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';

/**
 * 菜单种子数据服务
 * 提供初始化菜单数据的功能
 */
@Injectable()
export class MenuSeed {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}

  /**
   * 初始化菜单数据
   * 检查是否已有菜单数据，如果没有则插入基础菜单
   */
  async run(): Promise<void> {
    // 检查是否已有菜单数据
    const count = await this.menuRepository.count();
    if (count > 0) {
      console.log('菜单数据已存在，跳过初始化');
      return;
    }

    console.log('开始初始化菜单数据...');

    // 基础菜单数据
    const menus: Partial<Menu>[] = [
      {
        id: '1',
        name: '系统管理',
        path: '/system',
        component: 'Layout',
        icon: 'setting',
        type: 'menu',
        sort: 100,
        show: true,
        enabled: true,
        roles: ['admin'],
      },
      {
        id: '2',
        name: '用户管理',
        path: '/system/users',
        component: 'UserManagement',
        parentId: '1',
        sort: 1,
        type: 'menu',
        show: true,
        enabled: true,
        roles: ['admin'],
        permissionCode: 'user:manage',
      },
      {
        id: '3',
        name: '菜单管理',
        path: '/system/menus',
        component: 'MenuManagement',
        parentId: '1',
        sort: 2,
        type: 'menu',
        show: true,
        enabled: true,
        roles: ['admin'],
        permissionCode: 'menu:manage',
      },
      {
        id: '4',
        name: '文档管理',
        path: '/documents',
        component: 'DocumentManagement',
        icon: 'file-text',
        type: 'menu',
        sort: 10,
        show: true,
        enabled: true,
        roles: ['admin', 'user'],
        permissionCode: 'document:view',
      },
      {
        id: '5',
        name: '角色管理',
        path: '/system/roles',
        component: 'RoleManagement',
        parentId: '1',
        sort: 3,
        type: 'menu',
        show: true,
        enabled: true,
        roles: ['admin'],
        permissionCode: 'role:manage',
      },
    ];

    // 插入菜单数据
    await this.menuRepository.save(menus);
    console.log('菜单数据初始化完成，共插入', menus.length, '条记录');
  }
}
