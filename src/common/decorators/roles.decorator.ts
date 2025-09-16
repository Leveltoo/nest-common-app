import { SetMetadata } from '@nestjs/common';

/**
 * 角色装饰器
 * 用于在控制器方法上指定访问所需的角色
 * @param roles 允许访问的角色列表
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
