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
import { DictionaryService } from '../services/dictionary.service';
import {
  CreateDictionaryDto,
  UpdateDictionaryDto,
  DictionaryResponseDto,
  CreateDictionaryItemDto,
  UpdateDictionaryItemDto,
  DictionaryItemResponseDto,
} from '../dto/dictionary.dto';

/**
 * 字典控制器
 * 提供字典和字典项相关的API接口
 */
@ApiTags('字典管理')
@Controller('dictionaries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  // 字典相关接口

  /**
   * 创建字典
   * @param createDictionaryDto 创建字典数据
   * @returns 创建的字典信息
   * @requires 管理员角色
   */
  @Post()
  @ApiOperation({ summary: '创建字典' })
  @ApiResponse({
    status: 201,
    description: '字典创建成功',
    type: DictionaryResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async createDictionary(
    @Body() createDictionaryDto: CreateDictionaryDto,
  ): Promise<DictionaryResponseDto> {
    return await this.dictionaryService.createDictionary(createDictionaryDto);
  }

  /**
   * 获取所有字典
   * @returns 字典列表
   */
  @Get()
  @ApiOperation({ summary: '获取所有字典' })
  @ApiResponse({
    status: 200,
    description: '获取字典列表成功',
    type: [DictionaryResponseDto],
  })
  @ApiResponse({ status: 401, description: '未授权' })
  async getAllDictionaries(): Promise<DictionaryResponseDto[]> {
    return await this.dictionaryService.getAllDictionaries();
  }

  /**
   * 根据ID获取字典
   * @param id 字典ID
   * @returns 字典信息
   */
  @Get(':id')
  @ApiOperation({ summary: '根据ID获取字典' })
  @ApiResponse({
    status: 200,
    description: '获取字典成功',
    type: DictionaryResponseDto,
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '字典不存在' })
  async getDictionaryById(
    @Param('id') id: string,
  ): Promise<DictionaryResponseDto> {
    return await this.dictionaryService.getDictionaryById(id);
  }

  /**
   * 根据编码获取字典
   * @param code 字典编码
   * @returns 字典信息
   */
  @Get('code/:code')
  @ApiOperation({ summary: '根据编码获取字典' })
  @ApiResponse({
    status: 200,
    description: '获取字典成功',
    type: DictionaryResponseDto,
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '字典不存在' })
  async getDictionaryByCode(
    @Param('code') code: string,
  ): Promise<DictionaryResponseDto> {
    return await this.dictionaryService.getDictionaryByCode(code);
  }

  /**
   * 更新字典
   * @param id 字典ID
   * @param updateDictionaryDto 更新字典数据
   * @returns 更新后的字典信息
   * @requires 管理员角色
   */
  @Put(':id')
  @ApiOperation({ summary: '更新字典' })
  @ApiResponse({
    status: 200,
    description: '字典更新成功',
    type: DictionaryResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '字典不存在' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async updateDictionary(
    @Param('id') id: string,
    @Body() updateDictionaryDto: UpdateDictionaryDto,
  ): Promise<DictionaryResponseDto> {
    return await this.dictionaryService.updateDictionary(
      id,
      updateDictionaryDto,
    );
  }

  /**
   * 删除字典
   * @param id 字典ID
   * @requires 管理员角色
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除字典' })
  @ApiResponse({ status: 200, description: '字典删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '字典不存在' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async deleteDictionary(@Param('id') id: string): Promise<void> {
    return await this.dictionaryService.deleteDictionary(id);
  }

  // 字典项相关接口

  /**
   * 创建字典项
   * @param createDictionaryItemDto 创建字典项数据
   * @returns 创建的字典项信息
   * @requires 管理员角色
   */
  @Post('items')
  @ApiOperation({ summary: '创建字典项' })
  @ApiResponse({
    status: 201,
    description: '字典项创建成功',
    type: DictionaryItemResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '字典不存在' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async createDictionaryItem(
    @Body() createDictionaryItemDto: CreateDictionaryItemDto,
  ): Promise<DictionaryItemResponseDto> {
    return await this.dictionaryService.createDictionaryItem(
      createDictionaryItemDto,
    );
  }

  /**
   * 获取字典的所有项
   * @param dictionaryId 字典ID
   * @returns 字典项列表
   */
  @Get(':dictionaryId/items')
  @ApiOperation({ summary: '获取字典的所有项' })
  @ApiResponse({
    status: 200,
    description: '获取字典项列表成功',
    type: [DictionaryItemResponseDto],
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '字典不存在' })
  async getDictionaryItems(
    @Param('dictionaryId') dictionaryId: string,
  ): Promise<DictionaryItemResponseDto[]> {
    return await this.dictionaryService.getDictionaryItems(dictionaryId);
  }

  /**
   * 根据字典编码获取字典项
   * @param dictionaryCode 字典编码
   * @returns 字典项列表
   */
  @Get('code/:dictionaryCode/items')
  @ApiOperation({ summary: '根据字典编码获取字典项' })
  @ApiResponse({
    status: 200,
    description: '获取字典项列表成功',
    type: [DictionaryItemResponseDto],
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '字典不存在' })
  async getDictionaryItemsByCode(
    @Param('dictionaryCode') dictionaryCode: string,
  ): Promise<DictionaryItemResponseDto[]> {
    return await this.dictionaryService.getDictionaryItemsByCode(
      dictionaryCode,
    );
  }

  /**
   * 根据ID获取字典项
   * @param id 字典项ID
   * @returns 字典项信息
   */
  @Get('items/:id')
  @ApiOperation({ summary: '根据ID获取字典项' })
  @ApiResponse({
    status: 200,
    description: '获取字典项成功',
    type: DictionaryItemResponseDto,
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '字典项不存在' })
  async getDictionaryItemById(
    @Param('id') id: string,
  ): Promise<DictionaryItemResponseDto> {
    return await this.dictionaryService.getDictionaryItemById(id);
  }

  /**
   * 更新字典项
   * @param id 字典项ID
   * @param updateDictionaryItemDto 更新字典项数据
   * @returns 更新后的字典项信息
   * @requires 管理员角色
   */
  @Put('items/:id')
  @ApiOperation({ summary: '更新字典项' })
  @ApiResponse({
    status: 200,
    description: '字典项更新成功',
    type: DictionaryItemResponseDto,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '字典项不存在' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async updateDictionaryItem(
    @Param('id') id: string,
    @Body() updateDictionaryItemDto: UpdateDictionaryItemDto,
  ): Promise<DictionaryItemResponseDto> {
    return await this.dictionaryService.updateDictionaryItem(
      id,
      updateDictionaryItemDto,
    );
  }

  /**
   * 删除字典项
   * @param id 字典项ID
   * @requires 管理员角色
   */
  @Delete('items/:id')
  @ApiOperation({ summary: '删除字典项' })
  @ApiResponse({ status: 200, description: '字典项删除成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  @ApiResponse({ status: 404, description: '字典项不存在' })
  @ApiResponse({ status: 403, description: '权限不足' })
  @Roles('admin')
  @UseGuards(RoleGuard)
  async deleteDictionaryItem(@Param('id') id: string): Promise<void> {
    return await this.dictionaryService.deleteDictionaryItem(id);
  }
}
