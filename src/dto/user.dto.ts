import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户注册DTO
 * 用于用户注册请求的数据验证
 */
export class RegisterUserDto {
  @ApiProperty({
    description: '用户名',
    example: '张三',
    minLength: 3,
    maxLength: 20,
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: '邮箱地址',
    example: 'zhangsan@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '密码',
    example: 'Password123!',
    minLength: 8,
    required: true,
  })
  @IsString()
  @MinLength(8)
  password: string;
}

/**
 * 用户登录DTO
 * 用于用户登录请求的数据验证
 */
export class LoginUserDto {
  @ApiProperty({
    description: '用户名',
    example: '张三',
    required: true,
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: '密码',
    example: 'Password123!',
    required: true,
  })
  @IsString()
  password: string;
}

/**
 * 更新用户DTO
 * 用于更新用户信息请求的数据验证
 */
export class UpdateUserDto {
  @ApiProperty({
    description: '用户名',
    example: '张三',
    minLength: 3,
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

/**
 * 用户响应DTO
 * 用于用户信息响应的数据格式
 */
export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
