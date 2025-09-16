import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dictionary } from '../entities/dictionary.entity';
import { DictionaryItem } from '../entities/dictionary-item.entity';
import {
  CreateDictionaryDto,
  UpdateDictionaryDto,
  DictionaryResponseDto,
  CreateDictionaryItemDto,
  UpdateDictionaryItemDto,
  DictionaryItemResponseDto,
} from '../dto/dictionary.dto';

/**
 * 字典服务
 * 提供字典和字典项相关的业务逻辑
 */
@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(Dictionary)
    private readonly dictionaryRepository: Repository<Dictionary>,
    @InjectRepository(DictionaryItem)
    private readonly dictionaryItemRepository: Repository<DictionaryItem>,
  ) {}

  // 字典相关方法

  /**
   * 创建字典
   * @param createDictionaryDto 创建字典数据
   * @returns 创建的字典信息
   */
  async createDictionary(
    createDictionaryDto: CreateDictionaryDto,
  ): Promise<DictionaryResponseDto> {
    const dictionary = this.dictionaryRepository.create(createDictionaryDto);
    const savedDictionary = await this.dictionaryRepository.save(dictionary);
    return this.mapDictionaryToResponseDto(savedDictionary);
  }

  /**
   * 获取所有字典
   * @returns 字典列表
   */
  async getAllDictionaries(): Promise<DictionaryResponseDto[]> {
    const dictionaries = await this.dictionaryRepository.find();
    return dictionaries.map((dictionary) =>
      this.mapDictionaryToResponseDto(dictionary),
    );
  }

  /**
   * 根据ID获取字典
   * @param id 字典ID
   * @returns 字典信息
   * @throws NotFoundException 当字典不存在时抛出异常
   */
  async getDictionaryById(id: string): Promise<DictionaryResponseDto> {
    const dictionary = await this.dictionaryRepository.findOneBy({ id });
    if (!dictionary) {
      throw new NotFoundException(`字典不存在: ${id}`);
    }
    return this.mapDictionaryToResponseDto(dictionary);
  }

  /**
   * 根据编码获取字典
   * @param code 字典编码
   * @returns 字典信息
   * @throws NotFoundException 当字典不存在时抛出异常
   */
  async getDictionaryByCode(code: string): Promise<DictionaryResponseDto> {
    const dictionary = await this.dictionaryRepository.findOneBy({ code });
    if (!dictionary) {
      throw new NotFoundException(`字典不存在: ${code}`);
    }
    return this.mapDictionaryToResponseDto(dictionary);
  }

  /**
   * 更新字典
   * @param id 字典ID
   * @param updateDictionaryDto 更新字典数据
   * @returns 更新后的字典信息
   * @throws NotFoundException 当字典不存在时抛出异常
   */
  async updateDictionary(
    id: string,
    updateDictionaryDto: UpdateDictionaryDto,
  ): Promise<DictionaryResponseDto> {
    const dictionary = await this.dictionaryRepository.findOneBy({ id });
    if (!dictionary) {
      throw new NotFoundException(`字典不存在: ${id}`);
    }

    // 合并更新数据
    const updatedDictionary = this.dictionaryRepository.merge(
      dictionary,
      updateDictionaryDto,
    );
    const savedDictionary =
      await this.dictionaryRepository.save(updatedDictionary);

    return this.mapDictionaryToResponseDto(savedDictionary);
  }

  /**
   * 删除字典
   * @param id 字典ID
   * @throws NotFoundException 当字典不存在时抛出异常
   */
  async deleteDictionary(id: string): Promise<void> {
    const dictionary = await this.dictionaryRepository.findOneBy({ id });
    if (!dictionary) {
      throw new NotFoundException(`字典不存在: ${id}`);
    }

    await this.dictionaryRepository.remove(dictionary);
  }

  // 字典项相关方法

  /**
   * 创建字典项
   * @param createDictionaryItemDto 创建字典项数据
   * @returns 创建的字典项信息
   * @throws NotFoundException 当字典不存在时抛出异常
   */
  async createDictionaryItem(
    createDictionaryItemDto: CreateDictionaryItemDto,
  ): Promise<DictionaryItemResponseDto> {
    const { dictionaryId, ...itemData } = createDictionaryItemDto;

    // 检查字典是否存在
    const dictionary = await this.dictionaryRepository.findOneBy({
      id: dictionaryId,
    });
    if (!dictionary) {
      throw new NotFoundException(`字典不存在: ${dictionaryId}`);
    }

    const dictionaryItem = this.dictionaryItemRepository.create({
      ...itemData,
      dictionary,
    });

    const savedItem = await this.dictionaryItemRepository.save(dictionaryItem);
    return this.mapDictionaryItemToResponseDto(savedItem);
  }

  /**
   * 获取字典的所有项
   * @param dictionaryId 字典ID
   * @returns 字典项列表
   * @throws NotFoundException 当字典不存在时抛出异常
   */
  async getDictionaryItems(
    dictionaryId: string,
  ): Promise<DictionaryItemResponseDto[]> {
    // 检查字典是否存在
    const dictionary = await this.dictionaryRepository.findOneBy({
      id: dictionaryId,
    });
    if (!dictionary) {
      throw new NotFoundException(`字典不存在: ${dictionaryId}`);
    }

    const items = await this.dictionaryItemRepository.find({
      where: { dictionary: { id: dictionaryId }, enabled: true },
      order: { sort: 'ASC' },
      relations: ['dictionary'],
    });

    return items.map((item) => this.mapDictionaryItemToResponseDto(item));
  }

  /**
   * 根据字典编码获取字典项
   * @param dictionaryCode 字典编码
   * @returns 字典项列表
   * @throws NotFoundException 当字典不存在时抛出异常
   */
  async getDictionaryItemsByCode(
    dictionaryCode: string,
  ): Promise<DictionaryItemResponseDto[]> {
    // 检查字典是否存在
    const dictionary = await this.dictionaryRepository.findOneBy({
      code: dictionaryCode,
    });
    if (!dictionary) {
      throw new NotFoundException(`字典不存在: ${dictionaryCode}`);
    }

    const items = await this.dictionaryItemRepository.find({
      where: { dictionary: { id: dictionary.id }, enabled: true },
      order: { sort: 'ASC' },
      relations: ['dictionary'],
    });

    return items.map((item) => this.mapDictionaryItemToResponseDto(item));
  }

  /**
   * 根据ID获取字典项
   * @param id 字典项ID
   * @returns 字典项信息
   * @throws NotFoundException 当字典项不存在时抛出异常
   */
  async getDictionaryItemById(id: string): Promise<DictionaryItemResponseDto> {
    const item = await this.dictionaryItemRepository.findOne({
      where: { id },
      relations: ['dictionary'],
    });
    if (!item) {
      throw new NotFoundException(`字典项不存在: ${id}`);
    }
    return this.mapDictionaryItemToResponseDto(item);
  }

  /**
   * 更新字典项
   * @param id 字典项ID
   * @param updateDictionaryItemDto 更新字典项数据
   * @returns 更新后的字典项信息
   * @throws NotFoundException 当字典项不存在时抛出异常
   */
  async updateDictionaryItem(
    id: string,
    updateDictionaryItemDto: UpdateDictionaryItemDto,
  ): Promise<DictionaryItemResponseDto> {
    const item = await this.dictionaryItemRepository.findOne({
      where: { id },
      relations: ['dictionary'],
    });
    if (!item) {
      throw new NotFoundException(`字典项不存在: ${id}`);
    }

    // 合并更新数据
    const updatedItem = this.dictionaryItemRepository.merge(
      item,
      updateDictionaryItemDto,
    );
    const savedItem = await this.dictionaryItemRepository.save(updatedItem);

    return this.mapDictionaryItemToResponseDto(savedItem);
  }

  /**
   * 删除字典项
   * @param id 字典项ID
   * @throws NotFoundException 当字典项不存在时抛出异常
   */
  async deleteDictionaryItem(id: string): Promise<void> {
    const item = await this.dictionaryItemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException(`字典项不存在: ${id}`);
    }

    await this.dictionaryItemRepository.remove(item);
  }

  // 映射方法

  /**
   * 将Dictionary实体映射为DictionaryResponseDto
   * @param dictionary Dictionary实体
   * @returns DictionaryResponseDto
   */
  private mapDictionaryToResponseDto(
    dictionary: Dictionary,
  ): DictionaryResponseDto {
    return {
      id: dictionary.id,
      name: dictionary.name,
      code: dictionary.code,
      description: dictionary.description,
      enabled: dictionary.enabled,
      createdAt: dictionary.createdAt,
      updatedAt: dictionary.updatedAt,
    };
  }

  /**
   * 将DictionaryItem实体映射为DictionaryItemResponseDto
   * @param item DictionaryItem实体
   * @returns DictionaryItemResponseDto
   */
  private mapDictionaryItemToResponseDto(
    item: DictionaryItem,
  ): DictionaryItemResponseDto {
    return {
      id: item.id,
      dictionary: this.mapDictionaryToResponseDto(item.dictionary),
      value: item.value,
      label: item.label,
      sort: item.sort,
      enabled: item.enabled,
      extra: item.extra,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
}
