import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Dictionary } from './dictionary.entity';

/**
 * 字典项实体类
 * 表示系统中的数据字典具体项
 */
@Entity('dictionary_items')
export class DictionaryItem {
  /**
   * 字典项唯一标识符
   */
  @ApiProperty({
    description: '字典项唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 所属字典
   */
  @ApiProperty({
    description: '所属字典',
    type: () => Dictionary,
  })
  @ManyToOne(() => Dictionary, (dictionary) => dictionary.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'dictionary_id' })
  dictionary: Dictionary;

  /**
   * 字典项值
   */
  @ApiProperty({
    description: '字典项值',
    example: '1',
    required: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  value: string;

  /**
   * 字典项标签
   */
  @ApiProperty({
    description: '字典项标签',
    example: '启用',
    required: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  label: string;

  /**
   * 排序
   */
  @ApiProperty({
    description: '排序',
    example: 1,
    default: 0,
  })
  @Column({ default: 0 })
  sort: number;

  /**
   * 是否启用
   */
  @ApiProperty({
    description: '是否启用',
    example: true,
    default: true,
  })
  @Column({ default: true })
  enabled: boolean;

  /**
   * 扩展信息
   */
  @ApiProperty({
    description: '扩展信息',
    example: '{"color": "green"}',
    required: false,
  })
  @Column({ type: 'json', nullable: true })
  extra?: Record<string, any>;

  /**
   * 创建时间
   */
  @ApiProperty({
    description: '创建时间',
    example: '2024-05-01T10:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 更新时间
   */
  @ApiProperty({
    description: '更新时间',
    example: '2024-05-01T10:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
