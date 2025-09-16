import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import {
  RegisterUserDto,
  LoginUserDto,
  UserResponseDto,
} from '../dto/user.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { envConfig } from '../config/env.config';

/**
 * 认证服务
 * 提供用户注册、登录、注销等认证相关功能
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   * @param registerDto 用户注册数据
   * @returns 注册成功的用户信息
   */
  async register(registerDto: RegisterUserDto): Promise<UserResponseDto> {
    // 检查用户名是否已存在
    const existingUser = await this.userRepository.findOneBy({
      username: registerDto.username,
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (existingEmail) {
      throw new ConflictException('邮箱已存在');
    }

    // 哈希密码
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    // 创建新用户
    const user = this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      passwordHash,
    });

    // 保存用户
    await this.userRepository.save(user);

    // 返回用户响应数据
    return this.mapToUserResponse(user);
  }

  /**
   * 用户登录
   * @param loginDto 用户登录数据
   * @returns 访问令牌、刷新令牌和用户信息
   */
  async login(
    loginDto: LoginUserDto,
  ): Promise<{ token: string; refreshToken: string; user: UserResponseDto }> {
    const user = await this.userRepository.findOneBy({
      username: loginDto.username,
    });

    // 检查用户是否存在以及密码是否正确
    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 检查用户是否被列入黑名单
    if (user.status === 'blocked') {
      throw new UnauthorizedException('您的账户已被禁用，请联系管理员');
    }

    // 生成JWT访问令牌
    const accessTokenPayload = {
      username: user.username,
      sub: user.id,
      role: user.role,
      type: 'access',
    };
    const token = this.jwtService.sign(accessTokenPayload, {
      expiresIn: envConfig.jwtExpiresIn,
    });

    // 生成JWT刷新令牌（有效期通常比访问令牌长）
    const refreshTokenPayload = {
      username: user.username,
      sub: user.id,
      type: 'refresh',
    };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: '7d', // 刷新令牌有效期为7天
    });

    return { token, refreshToken, user: this.mapToUserResponse(user) };
  }

  /**
   * 刷新访问令牌
   * @param refreshTokenDto 刷新令牌数据
   * @returns 新的访问令牌和刷新令牌
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ token: string; refreshToken: string }> {
    try {
      // 验证刷新令牌
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: envConfig.jwtSecret,
        },
      );

      // 检查令牌类型是否为刷新令牌
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('无效的刷新令牌');
      }

      // 查找用户
      const user = await this.userRepository.findOneBy({ id: payload.sub });
      if (!user) {
        throw new NotFoundException('用户不存在');
      }

      // 检查用户是否被列入黑名单
      if (user.status === 'blocked') {
        throw new UnauthorizedException('您的账户已被禁用，请联系管理员');
      }

      // 生成新的访问令牌
      const newAccessTokenPayload = {
        username: user.username,
        sub: user.id,
        role: user.role,
        type: 'access',
      };
      const newToken = this.jwtService.sign(newAccessTokenPayload, {
        expiresIn: envConfig.jwtExpiresIn,
      });

      // 生成新的刷新令牌
      const newRefreshTokenPayload = {
        username: user.username,
        sub: user.id,
        type: 'refresh',
      };
      const newRefreshToken = this.jwtService.sign(newRefreshTokenPayload, {
        expiresIn: '7d',
      });

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      // 捕获令牌过期、无效等错误
      throw new UnauthorizedException('刷新令牌无效或已过期');
    }
  }

  /**
   * 用户登出
   * 注意：在无状态JWT认证中，登出主要由前端实现，这里提供一个API端点用于额外的服务器端处理
   * @param userId 用户ID
   */
  async logout(userId: string): Promise<void> {
    // 在实际应用中，这里可以实现额外的逻辑，如：
    // 1. 将令牌加入黑名单
    // 2. 更新用户登出时间
    // 3. 清理与用户会话相关的缓存数据
    // 由于当前项目没有实现令牌黑名单机制，这里仅返回成功
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
  }

  /**
   * 将用户实体映射为用户响应DTO
   * @param user 用户实体
   * @returns 用户响应DTO
   */
  private mapToUserResponse(user: User): UserResponseDto {
    const { id, username, email, role, status, createdAt, updatedAt } = user;
    return { id, username, email, role, status, createdAt, updatedAt };
  }
}
