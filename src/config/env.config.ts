/**
 * 环境配置文件
 * 提供应用程序的环境变量配置
 */
export const envConfig = {
  port: parseInt(process.env.PORT || '9876', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  apiPrefix: process.env.API_PREFIX || 'api',
};
