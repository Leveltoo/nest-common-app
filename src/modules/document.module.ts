import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../entities/document.entity';
import { DocumentVersion } from '../entities/document-version.entity';
import { DocumentService } from '../services/document.service';
import { DocumentController } from '../controllers/document.controller';
import { AuthModule } from './auth.module';

/**
 * 文档模块
 * 提供文档管理功能
 */
@Module({
  imports: [TypeOrmModule.forFeature([Document, DocumentVersion]), AuthModule],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {}
