import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { envConfig } from '../config/env.config';

/**
 * 认证模块
 * 提供用户认证和授权功能
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: envConfig.jwtSecret,
      signOptions: { expiresIn: envConfig.jwtExpiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
