import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FileUploadService } from '../services/file-upload.service';
import { UploadFileDto, FileUploadResponseDto } from '../dto/file-upload.dto';
import { Request, Response } from 'express';

/**
 * 文件上传控制器
 * 处理文件上传相关的HTTP请求
 */
@ApiTags('文件上传')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  /**
   * 上传文件到数据库
   * @param file 上传的文件
   * @param uploadFileDto 文件上传数据
   * @param req HTTP请求对象
   * @returns 上传的文件信息
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '上传文件',
    description: '将文件上传并存储到数据库',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        description: {
          type: 'string',
        },
        documentId: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '文件上传成功',
    type: FileUploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '输入数据无效或文件为空',
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要有效的JWT令牌',
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @Req() req: Request,
  ): Promise<FileUploadResponseDto> {
    const userId = req.user.sub;
    return this.fileUploadService.uploadFile(file, uploadFileDto, userId);
  }

  /**
   * 获取用户的所有文件
   * @param req HTTP请求对象
   * @returns 用户的所有文件列表
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取所有文件',
    description: '获取当前用户的所有文件列表',
  })
  @ApiResponse({
    status: 200,
    description: '文件列表获取成功',
    type: [FileUploadResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要有效的JWT令牌',
  })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserFiles(@Req() req: Request): Promise<FileUploadResponseDto[]> {
    const userId = req.user.sub;
    return this.fileUploadService.getUserFiles(userId);
  }

  /**
   * 获取单个文件信息
   * @param id 文件ID
   * @param req HTTP请求对象
   * @returns 文件详细信息
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '获取文件信息',
    description: '根据ID获取文件的详细信息',
  })
  @ApiParam({
    name: 'id',
    description: '文件唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '文件信息获取成功',
    type: FileUploadResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要有效的JWT令牌',
  })
  @ApiResponse({
    status: 404,
    description: '文件不存在或无权访问',
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getFileInfo(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<FileUploadResponseDto> {
    const userId = req.user.sub;
    return this.fileUploadService.getFileInfo(id, userId);
  }

  /**
   * 下载文件
   * @param id 文件ID
   * @param req HTTP请求对象
   * @param res HTTP响应对象
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '下载文件',
    description: '根据ID下载文件内容',
  })
  @ApiParam({
    name: 'id',
    description: '文件唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '文件下载成功',
    content: {
      '*/*': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要有效的JWT令牌',
  })
  @ApiResponse({
    status: 404,
    description: '文件不存在或无权访问',
  })
  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  async downloadFile(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const userId = req.user.sub;
    const { file, stream } = await this.fileUploadService.getFileContent(
      id,
      userId,
    );

    // 设置响应头，触发文件下载
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.filename)}"`,
    );
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Length', file.size);

    // 发送文件内容
    res.send(stream);
  }

  /**
   * 删除文件
   * @param id 文件ID
   * @param req HTTP请求对象
   * @returns 删除状态
   * @requires 登录用户
   */
  @ApiBearerAuth()
  @ApiOperation({
    summary: '删除文件',
    description: '删除指定的文件',
  })
  @ApiParam({
    name: 'id',
    description: '文件唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: '文件删除成功',
    schema: {
      type: 'object',
      properties: {
        deleted: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要有效的JWT令牌',
  })
  @ApiResponse({
    status: 404,
    description: '文件不存在或无权访问',
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteFile(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<{ deleted: boolean }> {
    const userId = req.user.sub;
    return this.fileUploadService.deleteFile(id, userId);
  }
}
