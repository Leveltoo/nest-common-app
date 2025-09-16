import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

/**
 * 权限实体类
 * 表示系统中的权限配置
 */
@Entity('permissions')
export class Permission {
  /**
   * 权限唯一标识符
   */
  @ApiProperty({
    description: '权限唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 权限名称
   */
  @ApiProperty({
    description: '权限名称',
    example: '用户管理',
    required: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  /**
   * 权限码
   */
  @ApiProperty({
    description: '权限码',
    example: 'user:manage',
    required: true,
  })
  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  code: string;

  /**
   * 权限描述
   */
  @ApiProperty({
    description: '权限描述',
    example: '管理系统用户的权限',
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
   * 拥有此权限的用户
   */
  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_permissions',
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
