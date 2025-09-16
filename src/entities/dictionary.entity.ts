/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DictionaryItem } from './dictionary-item.entity';

/**
 * 字典实体类
 * 表示系统中的数据字典分类
 */
@Entity('dictionaries')
export class Dictionary {
  /**
   * 字典唯一标识符
   */
  @ApiProperty({
    description: '字典唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 字典名称
   */
  @ApiProperty({
    description: '字典名称',
    example: '用户状态',
    required: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  /**
   * 字典编码
   */
  @ApiProperty({
    description: '字典编码',
    example: 'USER_STATUS',
    required: true,
  })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  code: string;

  /**
   * 字典描述
   */
  @ApiProperty({
    description: '字典描述',
    example: '用户状态字典',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

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

  /**
   * 字典项列表
   */
  @OneToMany(() => DictionaryItem, (item) => item.dictionary)
  items: DictionaryItem[];
}
