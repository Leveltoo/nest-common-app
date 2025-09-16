import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { Menu } from '../entities/menu.entity';
import { MenuService } from '../services/menu.service';
import { MenuController } from '../controllers/menu.controller';

/**
 * 菜单模块
 * 包含菜单相关的实体、服务和控制器
 */
@Module({
  imports: [TypeOrmModule.forFeature([Menu]), AuthModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService], // 导出服务，以便其他模块可以使用
})
export class MenuModule {}
