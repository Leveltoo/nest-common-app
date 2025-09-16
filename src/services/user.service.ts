import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UpdateUserDto, UserResponseDto } from '../dto/user.dto';
import { DictionaryService } from './dictionary.service';

/**
 * 用户管理服务
 * 提供用户信息管理、黑名单管理等功能
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dictionaryService: DictionaryService,
  ) {}

  /**
   * 获取所有用户列表
   * @returns 用户列表
   */
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.mapToUserResponse(user));
  }

  /**
   * 根据ID获取用户信息
   * @param id 用户ID
   * @returns 用户信息
   * @throws NotFoundException 当用户不存在时抛出异常
   */
  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`用户不存在: ${id}`);
    }
    return this.mapToUserResponse(user);
  }

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param updateUserDto 更新用户数据
   * @returns 更新后的用户信息
   * @throws NotFoundException 当用户不存在时抛出异常
   */
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`用户不存在: ${id}`);
    }

    // 如果提供了密码，则哈希处理
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // 合并更新数据
    const updatedUser = this.userRepository.merge(user, updateUserDto);
    await this.userRepository.save(updatedUser);

    return this.mapToUserResponse(updatedUser);
  }

  /**
   * 将用户加入黑名单
   * @param id 用户ID
   * @returns 更新后的用户信息
   * @throws NotFoundException 当用户不存在时抛出异常
   */
  async blockUser(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`用户不存在: ${id}`);
    }

    user.status = 'blocked';
    await this.userRepository.save(user);

    return this.mapToUserResponse(user);
  }

  /**
   * 将用户从黑名单中移除
   * @param id 用户ID
   * @returns 更新后的用户信息
   * @throws NotFoundException 当用户不存在时抛出异常
   */
  async unblockUser(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`用户不存在: ${id}`);
    }

    user.status = 'active';
    await this.userRepository.save(user);

    return this.mapToUserResponse(user);
  }

  /**
   * 检查用户是否在黑名单中
   * @param id 用户ID
   * @returns 是否在黑名单中
   */
  async isUserBlocked(id: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      return false;
    }
    return user.status === 'blocked';
  }

  /**
   * 创建用户状态字典（如果不存在）
   * 用于维护用户状态的定义
   */
  async createUserStatusDictionary(): Promise<void> {
    try {
      // 检查用户状态字典是否已存在
      const existingDictionary =
        await this.dictionaryService.getDictionaryByCode('USER_STATUS');
      if (existingDictionary) {
        return; // 字典已存在，不需要创建
      }

      // 创建用户状态字典
      const userStatusDict = await this.dictionaryService.createDictionary({
        name: '用户状态',
        code: 'USER_STATUS',
        description: '定义系统中用户的状态',
        enabled: true,
      });

      // 创建字典项
      await this.dictionaryService.createDictionaryItem({
        dictionaryId: userStatusDict.id,
        value: 'active',
        label: '正常',
        sort: 1,
        enabled: true,
      });

      await this.dictionaryService.createDictionaryItem({
        dictionaryId: userStatusDict.id,
        value: 'blocked',
        label: '黑名单',
        sort: 2,
        enabled: true,
      });

      await this.dictionaryService.createDictionaryItem({
        dictionaryId: userStatusDict.id,
        value: 'pending',
        label: '待激活',
        sort: 3,
        enabled: true,
      });

      console.log('用户状态字典创建成功');
    } catch (error) {
      console.error('创建用户状态字典失败:', error);
      // 不抛出异常，避免影响应用启动
    }
  }

  /**
   * 将用户实体映射为用户响应DTO
   * @param user 用户实体
   * @returns 用户响应DTO
   */
  private mapToUserResponse(user: User): UserResponseDto {
    const { id, username, email, role, status, createdAt, updatedAt } = user;
    return { id, username, email, role, status, createdAt, updatedAt };
  }
}
