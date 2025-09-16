import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * 数据库配置文件
 * 提供TypeORM的连接配置选项
 */
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ai_editor',
  entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // 生产环境关闭自动同步
  logging: process.env.NODE_ENV !== 'production',
};
