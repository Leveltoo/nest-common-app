import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from '../entities/menu.entity';
import { CreateMenuDto, UpdateMenuDto, MenuResponseDto } from '../dto/menu.dto';

/**
 * 菜单服务
 * 提供菜单管理相关的业务逻辑
 */
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  /**
   * 创建新菜单
   * @param createMenuDto 菜单创建数据
   * @returns 创建的菜单信息
   */
  async createMenu(createMenuDto: CreateMenuDto): Promise<MenuResponseDto> {
    const menu = this.menuRepository.create(createMenuDto);
    const savedMenu = await this.menuRepository.save(menu);
    return this.mapToResponseDto(savedMenu);
  }

  /**
   * 获取所有菜单
   * @returns 菜单列表
   */
  async getAllMenus(): Promise<MenuResponseDto[]> {
    const menus = await this.menuRepository.find();
    return menus.map((menu) => this.mapToResponseDto(menu));
  }

  /**
   * 根据ID获取菜单
   * @param id 菜单ID
   * @returns 菜单信息
   * @throws NotFoundException 当菜单不存在时抛出异常
   */
  async getMenuById(id: string): Promise<MenuResponseDto> {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`菜单不存在: ${id}`);
    }
    return this.mapToResponseDto(menu);
  }

  /**
   * 更新菜单
   * @param id 菜单ID
   * @param updateMenuDto 菜单更新数据
   * @returns 更新后的菜单信息
   * @throws NotFoundException 当菜单不存在时抛出异常
   */
  async updateMenu(
    id: string,
    updateMenuDto: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException(`菜单不存在: ${id}`);
    }

    // 合并更新数据
    const updatedMenu = this.menuRepository.merge(menu, updateMenuDto);
    const savedMenu = await this.menuRepository.save(updatedMenu);

    return this.mapToResponseDto(savedMenu);
  }

  /**
   * 删除菜单
   * @param id 菜单ID
   * @returns 删除状态
   * @throws NotFoundException 当菜单不存在时抛出异常
   */
  async deleteMenu(id: string): Promise<{ deleted: boolean }> {
    const result = await this.menuRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`菜单不存在: ${id}`);
    }
    return { deleted: true };
  }

  /**
   * 获取用户有权访问的菜单
   * @param userRoles 用户角色列表
   * @returns 用户可访问的菜单列表
   */
  async getUserAccessibleMenus(
    userRoles: string[],
  ): Promise<MenuResponseDto[]> {
    // 查询用户角色可访问的启用且显示的菜单
    const query = this.menuRepository.createQueryBuilder('menu');

    // 构建角色查询条件
    if (userRoles && userRoles.length > 0) {
      query.where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('menus', 'm')
          .where('m.id = menu.id')
          .andWhere('ARRAY_LENGTH(m.roles, 1) IS NULL')
          .getQuery();

        return `(
          ${subQuery}
          OR menu.roles && :roles
        )`;
      });
    }

    // 添加其他条件
    query.andWhere('menu.enabled = :enabled', { enabled: true });
    query.andWhere('menu.show = :show', { show: true });
    query.orderBy('menu.sort', 'ASC');

    const menus = await query.setParameters({ roles: userRoles }).getMany();
    return menus.map((menu) => this.mapToResponseDto(menu));
  }

  /**
   * 根据权限码检查用户是否有权限
   * @param permissionCode 权限码
   * @param userRoles 用户角色列表
   * @returns 是否有权限
   */
  async checkPermission(
    permissionCode: string,
    userRoles: string[],
  ): Promise<boolean> {
    if (!permissionCode) {
      return true; // 如果没有指定权限码，默认有权限
    }

    const menu = await this.menuRepository.findOneBy({
      permissionCode,
      enabled: true,
    });

    if (!menu) {
      return false; // 权限码不存在
    }

    // 如果菜单没有指定角色，则所有用户都有权限
    if (!menu.roles || menu.roles.length === 0) {
      return true;
    }

    // 检查用户角色是否与菜单角色有交集
    return menu.roles.some((role) => userRoles.includes(role));
  }

  /**
   * 将Menu实体映射为MenuResponseDto
   * @param menu Menu实体
   * @returns MenuResponseDto
   */
  private mapToResponseDto(menu: Menu): MenuResponseDto {
    const responseDto = new MenuResponseDto();
    responseDto.id = menu.id;
    responseDto.name = menu.name;
    responseDto.path = menu.path;
    responseDto.component = menu.component;
    responseDto.icon = menu.icon;
    responseDto.parentId = menu.parentId;
    responseDto.sort = menu.sort;
    responseDto.type = menu.type;
    responseDto.permissionCode = menu.permissionCode;
    responseDto.show = menu.show;
    responseDto.enabled = menu.enabled;
    responseDto.roles = menu.roles || [];
    responseDto.createdAt = menu.createdAt;
    responseDto.updatedAt = menu.updatedAt;
    return responseDto;
  }
}
