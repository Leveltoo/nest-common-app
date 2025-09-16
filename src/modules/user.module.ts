import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { AuthModule } from './auth.module';
import { SystemModule } from './system.module';

/**
 * 用户模块
 * 提供用户管理和黑名单管理功能
 */
@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, SystemModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
