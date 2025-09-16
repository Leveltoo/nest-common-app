import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { envConfig } from '../../config/env.config';
import { JwtPayload } from '../types/express';

/**
 * JWT认证守卫
 * 用于保护需要认证的API端点
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  /**
   * 验证请求是否携带有效的JWT令牌
   * @param context 执行上下文
   * @returns 是否允许访问
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('未提供认证令牌');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: envConfig.jwtSecret,
      });

      // 将用户信息附加到请求对象
      request.user = payload;
    } catch {
      throw new UnauthorizedException('无效的认证令牌');
    }

    return true;
  }

  /**
   * 从请求头中提取JWT令牌
   * @param request HTTP请求对象
   * @returns 提取的JWT令牌或undefined
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
