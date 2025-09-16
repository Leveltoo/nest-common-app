import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionResponseDto,
} from '../dto/permission.dto';

/**
 * 权限服务
 * 提供权限相关的业务逻辑
 */
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * 创建权限
   * @param createPermissionDto 创建权限数据
   * @returns 创建的权限信息
   */
  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionResponseDto> {
    const permission = this.permissionRepository.create(createPermissionDto);
    const savedPermission = await this.permissionRepository.save(permission);
    return this.mapToResponseDto(savedPermission);
  }

  /**
   * 获取所有权限
   * @returns 权限列表
   */
  async getAllPermissions(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionRepository.find();
    return permissions.map((permission) => this.mapToResponseDto(permission));
  }

  /**
   * 根据ID获取权限
   * @param id 权限ID
   * @returns 权限信息
   * @throws NotFoundException 当权限不存在时抛出异常
   */
  async getPermissionById(id: string): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException(`权限不存在: ${id}`);
    }
    return this.mapToResponseDto(permission);
  }

  /**
   * 根据权限码获取权限
   * @param code 权限码
   * @returns 权限信息
   * @throws NotFoundException 当权限不存在时抛出异常
   */
  async getPermissionByCode(code: string): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findOneBy({ code });
    if (!permission) {
      throw new NotFoundException(`权限不存在: ${code}`);
    }
    return this.mapToResponseDto(permission);
  }

  /**
   * 更新权限
   * @param id 权限ID
   * @param updatePermissionDto 更新权限数据
   * @returns 更新后的权限信息
   * @throws NotFoundException 当权限不存在时抛出异常
   */
  async updatePermission(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException(`权限不存在: ${id}`);
    }

    // 合并更新数据
    const updatedPermission = this.permissionRepository.merge(
      permission,
      updatePermissionDto,
    );
    const savedPermission =
      await this.permissionRepository.save(updatedPermission);

    return this.mapToResponseDto(savedPermission);
  }

  /**
   * 删除权限
   * @param id 权限ID
   * @throws NotFoundException 当权限不存在时抛出异常
   */
  async deletePermission(id: string): Promise<void> {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission) {
      throw new NotFoundException(`权限不存在: ${id}`);
    }

    await this.permissionRepository.remove(permission);
  }

  /**
   * 检查用户是否有指定权限
   * @param userId 用户ID
   * @param permissionCode 权限码
   * @returns 是否有权限
   */
  async checkUserPermission(
    userId: string,
    permissionCode: string,
  ): Promise<boolean> {
    try {
      // 这里简化了实现，实际应该通过用户和权限的关联关系查询
      const permission = await this.permissionRepository.findOne({
        where: { code: permissionCode, enabled: true },
        relations: ['users'],
      });

      if (!permission) {
        return false;
      }

      return permission.users.some((user) => user.id === userId);
    } catch (error) {
      console.error('检查用户权限时出错:', error);
      return false;
    }
  }

  /**
   * 将Permission实体映射为PermissionResponseDto
   * @param permission Permission实体
   * @returns PermissionResponseDto
   */
  private mapToResponseDto(permission: Permission): PermissionResponseDto {
    return {
      id: permission.id,
      name: permission.name,
      code: permission.code,
      description: permission.description,
      enabled: permission.enabled,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
