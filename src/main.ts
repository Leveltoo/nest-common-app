import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envConfig } from './config/env.config';
import { MenuSeed } from './seeds/menu.seed';
import { PermissionSeed } from './seeds/permission.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置API全局前缀，符合RESTful规则
  app.setGlobalPrefix('api/v1');

  // 初始化菜单种子数据
  const menuSeed = app.get(MenuSeed);
  await menuSeed.run();

  // 初始化权限种子数据
  const permissionSeed = app.get(PermissionSeed);
  await permissionSeed.run();

  // Swagger文档配置
  const config = new DocumentBuilder()
    .setTitle('AI Editor API')
    .setDescription('AI编辑器后端API文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(envConfig.port);
  console.log('项目已经成功启动了 端口为', envConfig.port);
}
void bootstrap();
