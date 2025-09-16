import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request as NestRequest,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MenuService } from '../services/menu.service';
import { CreateMenuDto, UpdateMenuDto, MenuResponseDto } from '../dto/menu.dto';
import { Request } from 'express';

/**
 * 菜单控制器
 * 提供菜单管理的API接口
 */
@ApiTags('菜单管理')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  /**
   * 创建新菜单
   * @param createMenuDto 菜单创建数据
   * @returns 创建的菜单信息
   * @requires 管理员角色
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '创建菜单',
    description: '创建一个新的菜单，支持权限配置',
  })
  @ApiResponse({
    status: 201,
    description: '菜单创建成功',
    type: MenuResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '输入数据无效',
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  @ApiResponse({
    status: 403,
    description: '权限不足',
  })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async createMenu(
    @Body() createMenuDto: CreateMenuDto,
  ): Promise<MenuResponseDto> {
    return this.menuService.createMenu(createMenuDto);
  }

  /**
   * 获取所有菜单
   * @returns 菜单列表
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取所有菜单',
    description: '获取系统中的所有菜单列表',
  })
  @ApiResponse({
    status: 200,
    description: '菜单列表获取成功',
    type: [MenuResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllMenus(): Promise<MenuResponseDto[]> {
    return this.menuService.getAllMenus();
  }

  /**
   * 根据ID获取菜单
   * @param id 菜单ID
   * @returns 菜单信息
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取单个菜单',
    description: '根据ID获取菜单的详细信息',
  })
  @ApiParam({
    name: 'id',
    description: '菜单唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '菜单信息获取成功',
    type: MenuResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  @ApiResponse({
    status: 404,
    description: '菜单不存在',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMenuById(@Param('id') id: string): Promise<MenuResponseDto> {
    return this.menuService.getMenuById(id);
  }

  /**
   * 更新菜单
   * @param id 菜单ID
   * @param updateMenuDto 菜单更新数据
   * @returns 更新后的菜单信息
   * @requires 管理员角色
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '更新菜单',
    description: '更新指定菜单的信息，包括权限配置',
  })
  @ApiParam({
    name: 'id',
    description: '菜单唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '菜单更新成功',
    type: MenuResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '输入数据无效',
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  @ApiResponse({
    status: 404,
    description: '菜单不存在',
  })
  @ApiResponse({
    status: 403,
    description: '权限不足',
  })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  async updateMenu(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  /**
   * 删除菜单
   * @param id 菜单ID
   * @returns 删除状态
   * @requires 管理员角色
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '删除菜单',
    description: '删除指定的菜单',
  })
  @ApiParam({
    name: 'id',
    description: '菜单唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '菜单删除成功',
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  @ApiResponse({
    status: 404,
    description: '菜单不存在',
  })
  @ApiResponse({
    status: 403,
    description: '权限不足',
  })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async deleteMenu(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.menuService.deleteMenu(id);
  }

  /**
   * 获取当前用户有权访问的菜单
   * @param req 请求对象，包含用户信息
   * @returns 用户可访问的菜单列表
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取用户可访问的菜单',
    description: '根据用户角色获取当前用户有权访问的菜单列表',
  })
  @ApiResponse({
    status: 200,
    description: '用户可访问的菜单列表获取成功',
    type: [MenuResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  @UseGuards(JwtAuthGuard)
  @Get('user/accessible')
  async getUserAccessibleMenus(
    @NestRequest() req: Request,
  ): Promise<MenuResponseDto[]> {
    // 获取用户信息并确保类型安全
    const user = req.user;
    // 获取用户角色列表，默认为空数组
    const userRoles = Array.isArray(user?.roles) ? user.roles : [];
    return this.menuService.getUserAccessibleMenus(userRoles);
  }
}
