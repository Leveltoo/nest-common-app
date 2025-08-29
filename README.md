# Common App

基于 NestJS 框架的 TypeScript 起步模板，用于构建高效且可扩展的服务端应用。

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [安装与运行](#安装与运行)
- [测试](#测试)
- [部署](#部署)

## 项目概述

这是一个使用 NestJS 框架构建的后端应用程序模板。NestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的开发框架。它使用渐进式 JavaScript，支持 TypeScript，并结合了 OOP（面向对象编程）、FP（函数式编程）和 FRP（函数响应式编程）的元素。

该项目提供了一个基础的模块化结构，包括：
- 基础控制器 (Controller) - 处理 HTTP 请求
- 基础服务 (Service) - 封装业务逻辑
- 根模块 (Module) - 组织控制器和服务
- 应用入口文件 - 启动 NestJS 应用

## 技术栈

- [NestJS](https://nestjs.com/) v11.0.1 - 用于构建高效且可扩展的服务端应用程序的 Node.js 框架
- [TypeScript](https://www.typescriptlang.org/) v5.7.3 - JavaScript 的超集，添加了静态类型定义
- [Node.js](https://nodejs.org/) - JavaScript 运行时环境
- [Express.js](https://expressjs.com/) - Web 应用程序框架
- [Jest](https://jestjs.io/) v29.7.0 - JavaScript 测试框架
- [pnpm](https://pnpm.io/) - 快速、节省磁盘空间的包管理器

## 项目结构

```
src/
├── app.controller.ts     # 基础控制器，处理 HTTP 请求
├── app.service.ts        # 基础服务，封装业务逻辑
├── app.module.ts         # 根模块，组织控制器和服务
└── main.ts              # 应用入口，启动 NestJS 应用

test/
├── app.e2e-spec.ts      # 端到端测试
└── jest-e2e.json        # 端到端测试配置

Other files:
├── package.json         # 项目依赖和脚本配置
├── nest-cli.json        # Nest CLI 配置文件
├── tsconfig.json        # TypeScript 编译配置
└── eslint.config.mjs    # ESLint 配置文件
```

## 安装与运行

### 环境要求

- Node.js >= 18.x
- pnpm 包管理器

### 安装依赖

```bash
$ pnpm install
```

### 运行应用

```bash
# 开发模式
$ pnpm run start

# 监听模式（开发时推荐）
$ pnpm run start:dev

# 调试模式
$ pnpm run start:debug

# 生产模式
$ pnpm run start:prod
```

应用启动后，默认会在 `http://localhost:3000` 运行。

## 测试

```bash
# 单元测试
$ pnpm run test

# 端到端测试
$ pnpm run test:e2e

# 测试覆盖率
$ pnpm run test:cov
```

## 部署

当您准备好将 NestJS 应用程序部署到生产环境时，可以使用以下方式：

### 使用 Mau 部署到 AWS

Mau 是 NestJS 官方提供的部署平台，可轻松将应用程序部署到 AWS：

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

### 其他部署方式

您也可以使用 Docker、PM2 或其他 Node.js 应用程序部署方式来部署此应用程序。

## 许可证

此项目是 MIT 许可的开源项目。