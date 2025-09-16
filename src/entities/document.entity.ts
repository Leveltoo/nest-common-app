import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { DocumentVersion } from './document-version.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 文档实体类
 * 表示编辑器中的文档内容
 */
@Entity('documents')
export class Document {
  /**
   * 文档唯一标识符
   */
  @ApiProperty({
    description: '文档唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 文档标题
   */
  @ApiProperty({
    description: '文档标题',
    example: '我的第一篇文档',
    required: true,
  })
  @Column({ nullable: false })
  title: string;

  /**
   * 文档内容
   */
  @ApiProperty({
    description: '文档内容',
    example: '这是文档的内容...',
    required: false,
  })
  @Column({ type: 'longtext', nullable: true })
  content: string;

  /**
   * 文档类型
   */
  @ApiProperty({
    description: '文档类型',
    example: 'text',
    default: 'text',
  })
  @Column({ default: 'text' })
  type: string;

  /**
   * 文档所有者
   */
  @ApiProperty({
    description: '文档所有者',
    type: () => User,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * 所有者ID
   */
  @ApiProperty({
    description: '所有者ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    required: true,
  })
  @Column()
  userId: string;

  /**
   * 文档状态
   */
  @Column({ default: 'draft' })
  status: string;

  /**
   * 访问权限
   */
  @Column({ default: 'private' })
  access: string;

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

  /**
   * 文档的历史版本
   */
  @OneToMany(() => DocumentVersion, (version) => version.document, {
    cascade: true,
  })
  versions: DocumentVersion[];

  /**
   * 当前版本号
   */
  @ApiProperty({
    description: '当前版本号',
    example: 1,
  })
  @Column({ default: 1 })
  currentVersion: number;
}
