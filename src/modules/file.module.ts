import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUpload } from '../entities/file-upload.entity';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadController } from '../controllers/file-upload.controller';
import { AuthModule } from './auth.module';

/**
 * 文件模块
 * 提供文件上传、下载和管理功能
 */
@Module({
  imports: [TypeOrmModule.forFeature([FileUpload]), AuthModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileModule {}
