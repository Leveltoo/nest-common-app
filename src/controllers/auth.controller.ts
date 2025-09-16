import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  RegisterUserDto,
  LoginUserDto,
  UserResponseDto,
} from '../dto/user.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

/**
 * 认证控制器
 * 处理用户注册、登录等认证相关的HTTP请求
 */
@ApiTags('认证管理')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册接口
   * @param registerDto 用户注册数据
   * @returns 注册成功的用户信息
   */
  @ApiOperation({
    summary: '用户注册',
    description: '创建新用户账户',
  })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '输入数据无效或用户已存在',
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterUserDto,
  ): Promise<UserResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * 用户登录接口
   * @param loginDto 用户登录数据
   * @returns 访问令牌、刷新令牌和用户信息
   */
  @ApiOperation({
    summary: '用户登录',
    description: '验证用户凭据并返回JWT令牌',
  })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        refreshToken: { type: 'string' },
        user: { $ref: '#/components/schemas/UserResponseDto' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '用户名或密码错误',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginUserDto,
  ): Promise<{ token: string; refreshToken: string; user: UserResponseDto }> {
    return this.authService.login(loginDto);
  }

  /**
   * 刷新令牌接口
   * @param refreshTokenDto 刷新令牌数据
   * @returns 新的访问令牌和刷新令牌
   */
  @ApiOperation({
    summary: '刷新令牌',
    description: '使用刷新令牌获取新的访问令牌',
  })
  @ApiResponse({
    status: 200,
    description: '令牌刷新成功',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '刷新令牌无效或已过期',
  })
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ token: string; refreshToken: string }> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * 用户登出接口
   * @returns 登出成功信息
   */
  @ApiOperation({
    summary: '用户登出',
    description: '用户退出登录',
  })
  @ApiResponse({
    status: 200,
    description: '登出成功',
  })
  @ApiResponse({
    status: 401,
    description: '未授权',
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req): Promise<{ message: string }> {
    await this.authService.logout(req.user.sub);
    return { message: '登出成功' };
  }
}
