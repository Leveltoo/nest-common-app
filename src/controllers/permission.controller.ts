import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PermissionService } from '../services/permission.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionResponseDto,
} from '../dto/permission.dto';

/**
 * 权限控制器
 * 提供权限相关的API接口
 */
@ApiTags('权限管理')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * 创建权限
   * @param createPermissionDto 创建权限数据
   * @returns 创建的权限信息
   * @requires 管理员角色
   */
  @Post()
  @ApiOperation({ summary: '创建权限' })
  @ApiResponse({
    status: 201,
    description: '权限创建成功',
    type: PermissionResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionResponseDto> {
    return await this.permissionService.createPermission(createPermissionDto);
  }

  /**
   * 获取所有权限
   * @returns 权限列表
   * @requires 管理员角色
   */
  @Get()
  @ApiOperation({ summary: '获取所有权限' })
  @ApiResponse({
    status: 200,
    description: '获取权限列表成功',
    type: [PermissionResponseDto],
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async getAllPermissions(): Promise<PermissionResponseDto[]> {
    return await this.permissionService.getAllPermissions();
  }

  /**
   * 根据ID获取权限
   * @param id 权限ID
   * @returns 权限信息
   * @requires 管理员角色
   */
  @Get(':id')
  @ApiOperation({ summary: '根据ID获取权限' })
  @ApiResponse({
    status: 200,
    description: '获取权限成功',
    type: PermissionResponseDto,
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async getPermissionById(
    @Param('id') id: string,
  ): Promise<PermissionResponseDto> {
    return await this.permissionService.getPermissionById(id);
  }

  /**
   * 更新权限
   * @param id 权限ID
   * @param updatePermissionDto 更新权限数据
   * @returns 更新后的权限信息
   * @requires 管理员角色
   */
  @Put(':id')
  @ApiOperation({ summary: '更新权限' })
  @ApiResponse({
    status: 200,
    description: '权限更新成功',
    type: PermissionResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    return await this.permissionService.updatePermission(
      id,
      updatePermissionDto,
    );
  }

  /**
   * 删除权限
   * @param id 权限ID
   * @requires 管理员角色
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除权限' })
  @ApiResponse({ status: 200, description: '权限删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '权限不存在' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async deletePermission(@Param('id') id: string): Promise<void> {
    return await this.permissionService.deletePermission(id);
  }

  /**
   * 检查用户是否具有指定权限
   * @param userId 用户ID
   * @param permissionCode 权限编码
   * @returns 是否具有权限
   * @requires 管理员角色
   */
  @Get('check/:userId/:permissionCode')
  @ApiOperation({ summary: '检查用户是否具有指定权限' })
  @ApiResponse({ status: 200, description: '权限检查成功', type: Boolean })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async checkUserPermission(
    @Param('userId') userId: string,
    @Param('permissionCode') permissionCode: string,
  ): Promise<boolean> {
    return await this.permissionService.checkUserPermission(
      userId,
      permissionCode,
    );
  }

  /**
   * 获取用户的所有权限
   * @param userId 用户ID
   * @returns 用户的权限列表
   */ /*
  @Get('user/:userId')
  @ApiOperation({ summary: '获取用户的所有权限' })
  @ApiResponse({ status: 200, description: '获取用户权限列表成功', type: [PermissionResponseDto] })
  @ApiResponse({ status: 401, description: '未授权' })
  async getUserPermissions(@Param('userId') userId: string): Promise<PermissionResponseDto[]> {
    return await this.permissionService.getUserPermissions(userId);
  }*/
}
