<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## AI Editor Backend

一个基于NestJS开发的AI编辑器后端服务，提供用户管理、文档编辑、版本控制等功能。

## 技术栈

- **框架**: NestJS
- **ORM**: TypeORM
- **数据库**: MySQL/PostgreSQL
- **身份验证**: JWT
- **API文档**: Swagger
- **包管理**: pnpm

## 主要功能

1. **用户管理系统**
   - 用户注册、登录、信息管理
   - 用户黑名单管理
   - 基于JWT的身份验证

2. **文档管理系统**
   - 创建、读取、更新、删除文档
   - 文档版本历史记录
   - 版本恢复功能
   - 自动清理旧版本（保留最近100条）
   - 支持富文本和Markdown文档

3. **系统管理**
   - 菜单管理
   - 权限管理
   - 数据字典管理

4. **文件上传**
   - 支持文件上传和管理

## 项目结构

```
src/
├── app.module.ts          # 应用根模块
├── common/                # 通用模块
│   ├── decorators/        # 装饰器
│   ├── guards/            # 守卫（如JWT验证）
│   └── types/             # 类型定义
├── config/                # 配置文件
│   ├── database.config.ts # 数据库配置
│   └── env.config.ts      # 环境配置
├── controllers/           # 控制器
├── dto/                   # 数据传输对象
├── entities/              # 实体类
├── main.ts                # 应用入口
├── modules/               # 功能模块
├── seeds/                 # 数据种子
└── services/              # 服务层
```

## 环境配置

创建`.env`文件，配置以下环境变量：

```env
# 应用配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your-password
DB_DATABASE=ai-editor

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=3600s

# 文件上传配置
UPLOAD_DIR=uploads
```

## 安装和运行

### 前置要求

- Node.js >= 22.x
- pnpm
- MySQL/PostgreSQL数据库

### 安装依赖

```bash
pnpm install
```

### 数据库迁移

```bash
# 生成迁移文件
pnpm run migration:generate --name=initial-schema

# 执行迁移
pnpm run migration:run
```

### 运行项目

```bash
# 开发模式
pnpm run start:dev

# 生产模式
pnpm run build
pnpm run start:prod
```

### 测试

```bash
# 单元测试
pnpm run test

# E2E测试
pnpm run test:e2e

# 测试覆盖率
pnpm run test:cov
```

## API文档

启动项目后，访问以下URL查看Swagger API文档：

```
http://localhost:3000/api
```

## 部署指南

### Docker部署

创建`Dockerfile`：

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD [ "pnpm", "run", "start:prod" ]
```

创建`docker-compose.yml`：

```yaml
version: '3'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - DB_HOST=db
      - DB_PORT=3306
      - DB_USERNAME=root
      - DB_PASSWORD=your-password
      - DB_DATABASE=ai-editor
  
  db:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=your-password
      - MYSQL_DATABASE=ai-editor
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
```

启动容器：

```bash
docker-compose up -d
```

## 贡献指南

1. Fork项目仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 许可证

本项目采用MIT许可证 - 详见[LICENSE](LICENSE)文件

## 联系方式

如有问题或建议，请联系项目维护者。
