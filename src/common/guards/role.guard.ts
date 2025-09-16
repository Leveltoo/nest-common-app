import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

/**
 * 角色守卫
 * 用于基于用户角色的权限控制
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * 验证用户角色是否有权限访问特定端点
   * @param context 执行上下文
   * @returns 是否允许访问
   */
  canActivate(context: ExecutionContext): boolean {
    // 获取路由处理器上的角色元数据
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // 如果没有定义角色要求，则允许所有已认证用户访问
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    // 检查用户是否已认证
    if (!user) {
      throw new UnauthorizedException('未提供认证令牌');
    }

    // 检查用户角色是否满足要求
    // 如果用户角色字段是字符串，则转换为数组便于比较
    const userRoles =
      typeof user.role === 'string' ? [user.role] : user.role || [];

    // 检查用户是否拥有所需的任一角色
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new UnauthorizedException('您没有权限访问此资源');
    }

    return true;
  }
}
