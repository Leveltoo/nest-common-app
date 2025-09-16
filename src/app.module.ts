import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth.module';
import { DocumentModule } from './modules/document.module';
import { MenuModule } from './modules/menu.module';
import { SystemModule } from './modules/system.module';
import { FileModule } from './modules/file.module';
import { UserModule } from './modules/user.module';
import { databaseConfig } from './config/database.config';

/**
 * 应用程序主模块
 * 集成所有功能模块和全局配置
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    DocumentModule,
    MenuModule,
    SystemModule,
    FileModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
