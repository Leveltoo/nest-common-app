import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Post,
  Delete,
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
import { UserService } from '../services/user.service';
import { UpdateUserDto, UserResponseDto } from '../dto/user.dto';

/**
 * 用户控制器
 * 提供用户管理和黑名单管理相关的API接口
 */
@ApiTags('用户管理')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取所有用户列表
   * @returns 用户列表
   * @requires 管理员角色
   */
  @Get()
  @ApiOperation({ summary: '获取所有用户列表' })
  @ApiResponse({
    status: 200,
    description: '获取用户列表成功',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAllUsers();
  }

  /**
   * 获取指定用户信息
   * @param id 用户ID
   * @returns 用户信息
   * @requires 管理员角色
   */
  @Get(':id')
  @ApiOperation({ summary: '获取指定用户信息' })
  @ApiParam({ name: 'id', description: '用户唯一标识符' })
  @ApiResponse({
    status: 200,
    description: '获取用户信息成功',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  /**
   * 更新用户信息
   * @param id 用户ID
   * @param updateUserDto 更新用户数据
   * @returns 更新后的用户信息
   * @requires 管理员角色
   */
  @Put(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiParam({ name: 'id', description: '用户唯一标识符' })
  @ApiResponse({
    status: 200,
    description: '更新用户信息成功',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, updateUserDto);
  }

  /**
   * 将用户加入黑名单
   * @param id 用户ID
   * @returns 更新后的用户信息
   * @requires 管理员角色
   */
  @Put(':id/block')
  @ApiOperation({ summary: '将用户加入黑名单' })
  @ApiParam({ name: 'id', description: '用户唯一标识符' })
  @ApiResponse({
    status: 200,
    description: '用户加入黑名单成功',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async blockUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.blockUser(id);
  }

  /**
   * 将用户从黑名单中移除
   * @param id 用户ID
   * @returns 更新后的用户信息
   * @requires 管理员角色
   */
  @Put(':id/unblock')
  @ApiOperation({ summary: '将用户从黑名单中移除' })
  @ApiParam({ name: 'id', description: '用户唯一标识符' })
  @ApiResponse({
    status: 200,
    description: '用户移出黑名单成功',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async unblockUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.unblockUser(id);
  }

  /**
   * 检查用户是否在黑名单中
   * @param id 用户ID
   * @returns 是否在黑名单中
   * @requires 管理员角色
   */
  @Get(':id/is-blocked')
  @ApiOperation({ summary: '检查用户是否在黑名单中' })
  @ApiParam({ name: 'id', description: '用户唯一标识符' })
  @ApiResponse({
    status: 200,
    description: '检查成功',
    type: Boolean,
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async isUserBlocked(@Param('id') id: string): Promise<boolean> {
    return this.userService.isUserBlocked(id);
  }
}
