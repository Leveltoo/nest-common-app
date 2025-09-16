import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { Dictionary } from '../entities/dictionary.entity';
import { DictionaryItem } from '../entities/dictionary-item.entity';
import { Menu } from '../entities/menu.entity';
import { PermissionService } from '../services/permission.service';
import { DictionaryService } from '../services/dictionary.service';
import { SystemInitService } from '../services/system-init.service';
import { PermissionController } from '../controllers/permission.controller';
import { DictionaryController } from '../controllers/dictionary.controller';
import { AuthModule } from './auth.module';
import { MenuSeed } from '../seeds/menu.seed';
import { PermissionSeed } from '../seeds/permission.seed';
import { DictionarySeed } from '../seeds/dictionary.seed';

/**
 * 系统管理模块
 * 包含权限管理和字典管理功能
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Permission, Dictionary, DictionaryItem, Menu]),
    AuthModule,
  ],
  providers: [
    PermissionService,
    DictionaryService,
    MenuSeed,
    PermissionSeed,
    SystemInitService,
    DictionarySeed,
  ],
  controllers: [PermissionController, DictionaryController],
  exports: [PermissionService, DictionaryService],
})
export class SystemModule {}
