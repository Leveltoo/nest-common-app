import { Injectable, OnModuleInit } from '@nestjs/common';
import { DictionarySeed } from '../seeds/dictionary.seed';

/**
 * 系统初始化服务
 * 负责在系统启动时初始化必要的系统数据
 */
@Injectable()
export class SystemInitService implements OnModuleInit {
  constructor(private readonly dictionarySeed: DictionarySeed) {}

  /**
   * 模块初始化时执行
   * 调用各seed服务初始化系统数据
   */
  async onModuleInit(): Promise<void> {
    try {
      // 初始化字典数据
      await this.dictionarySeed.run();
    } catch (error) {
      console.error('系统初始化失败:', error.message);
    }
  }
}
