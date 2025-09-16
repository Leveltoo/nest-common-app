import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dictionary } from '../entities/dictionary.entity';
import { DictionaryItem } from '../entities/dictionary-item.entity';

/**
 * 字典种子数据服务
 * 提供初始化字典数据的功能，特别是用户状态字典
 */
@Injectable()
export class DictionarySeed {
  constructor(
    @InjectRepository(Dictionary)
    private readonly dictionaryRepository: Repository<Dictionary>,
    @InjectRepository(DictionaryItem)
    private readonly dictionaryItemRepository: Repository<DictionaryItem>,
  ) {}

  /**
   * 初始化字典数据
   * 主要初始化用户状态字典及其字典项
   */
  async run(): Promise<void> {
    console.log('开始初始化字典数据...');

    // 初始化用户状态字典
    await this.initializeUserStatusDictionary();

    console.log('字典数据初始化完成');
  }

  /**
   * 初始化用户状态字典
   * 创建用户状态字典及其字典项（活跃、禁用、待审核）
   */
  private async initializeUserStatusDictionary(): Promise<void> {
    // 检查用户状态字典是否已存在
    const existingDictionary = await this.dictionaryRepository.findOneBy({
      code: 'USER_STATUS',
    });

    if (existingDictionary) {
      console.log('用户状态字典已存在，跳过初始化');
      return;
    }

    console.log('开始初始化用户状态字典...');

    // 创建用户状态字典
    const userStatusDictionary = this.dictionaryRepository.create({
      name: '用户状态',
      code: 'USER_STATUS',
      description: '用户账户状态字典',
      enabled: true,
    });

    const savedDictionary =
      await this.dictionaryRepository.save(userStatusDictionary);

    // 创建用户状态字典项
    const dictionaryItems: Partial<DictionaryItem>[] = [
      {
        dictionary: savedDictionary,
        value: 'active',
        label: '活跃',
        sort: 1,
        enabled: true,
        extra: { description: '正常活跃的用户' },
      },
      {
        dictionary: savedDictionary,
        value: 'blocked',
        label: '禁用',
        sort: 2,
        enabled: true,
        extra: { description: '被禁用的用户（黑名单）' },
      },
      {
        dictionary: savedDictionary,
        value: 'pending',
        label: '待审核',
        sort: 3,
        enabled: true,
        extra: { description: '等待审核的新用户' },
      },
    ];

    // 插入字典项数据
    await this.dictionaryItemRepository.save(dictionaryItems);

    console.log(
      '用户状态字典初始化完成，共插入',
      dictionaryItems.length,
      '条字典项',
    );
  }
}
