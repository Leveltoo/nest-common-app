import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 文件上传实体类
 * 用于存储上传文件的元数据和内容
 */
@Entity('file_uploads')
export class FileUpload {
  /**
   * 文件唯一标识符
   */
  @ApiProperty({
    description: '文件唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 文件名
   */
  @ApiProperty({
    description: '原始文件名',
    example: 'my-document.pdf',
    required: true,
  })
  @Column({ nullable: false })
  filename: string;

  /**
   * 文件类型
   */
  @ApiProperty({
    description: '文件MIME类型',
    example: 'application/pdf',
    required: true,
  })
  @Column({ nullable: false })
  mimetype: string;

  /**
   * 文件大小
   */
  @ApiProperty({
    description: '文件大小（字节）',
    example: 102400,
    required: true,
  })
  @Column({ type: 'bigint', nullable: false })
  size: number;

  /**
   * 文件内容
   */
  @ApiProperty({
    description: '文件二进制内容',
    required: true,
  })
  @Column({ type: 'longblob', nullable: false })
  data: Buffer;

  /**
   * 文件上传者
   */
  @ApiProperty({
    description: '文件上传者',
    type: () => User,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * 上传者ID
   */
  @ApiProperty({
    description: '上传者ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    required: true,
  })
  @Column()
  userId: string;

  /**
   * 关联的文档ID（如果有）
   */
  @ApiProperty({
    description: '关联的文档ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  documentId?: string;

  /**
   * 文件描述
   */
  @ApiProperty({
    description: '文件描述',
    example: '项目需求文档',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * 创建时间
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
