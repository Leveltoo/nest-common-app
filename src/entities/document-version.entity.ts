import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from './document.entity';

/**
 * 文档版本实体类
 * 用于存储文档的历史版本信息
 */
@Entity('document_versions')
export class DocumentVersion {
  /**
   * 版本唯一标识符
   */
  @ApiProperty({
    description: '版本唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 所属文档
   */
  @ApiProperty({
    description: '所属文档',
    type: () => Document,
  })
  @ManyToOne(() => Document, (document) => document.versions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'documentId' })
  document: Document;

  /**
   * 所属文档ID
   */
  @ApiProperty({
    description: '所属文档ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @Column()
  documentId: string;

  /**
   * 版本号
   */
  @ApiProperty({
    description: '版本号',
    example: 1,
  })
  @Column()
  versionNumber: number;

  /**
   * 版本标题
   */
  @ApiProperty({
    description: '版本标题',
    example: '文档标题',
  })
  @Column({ nullable: true })
  title: string;

  /**
   * 版本内容
   */
  @ApiProperty({
    description: '版本内容',
    example: '文档内容...',
  })
  @Column({ type: 'longtext', nullable: true })
  content: string;

  /**
   * 文档类型
   */
  @ApiProperty({
    description: '文档类型',
    example: 'text',
  })
  @Column({ nullable: true })
  type: string;

  /**
   * 修改人ID
   */
  @ApiProperty({
    description: '修改人ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @Column({ nullable: true })
  modifiedBy: string;

  /**
   * 变更说明
   */
  @ApiProperty({
    description: '变更说明',
    example: '更新了文档内容',
  })
  @Column({ type: 'text', nullable: true })
  changeDescription: string;

  /**
   * 创建时间
   */
  @CreateDateColumn()
  createdAt: Date;
}
