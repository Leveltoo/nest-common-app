import { Request } from 'express';

/**
 * 定义JWT payload的类型结构
 */
export interface JwtPayload {
  /**
   * 用户唯一标识符
   */
  sub: string;

  /**
   * 用户名
   */
  username: string;

  /**
   * 用户角色列表
   */
  roles?: string[];

  /**
   * 其他可能的payload属性
   */
  [key: string]: any;
}

/**
 * 扩展Express的Request接口，添加用户属性
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * 经过JWT认证后的用户信息
       */
      user: JwtPayload;
    }
  }
}
