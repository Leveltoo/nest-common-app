import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Menu } from './menu.entity';

/**
 * 用户实体类
 * 表示系统中的用户信息
 */
@Entity('users')
export class User {
  /**
   * 用户唯一标识符
   */
  @ApiProperty({
    description: '用户唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 用户名
   */
  @ApiProperty({
    description: '用户名',
    example: '张三',
    required: true,
  })
  @Column({ unique: true, nullable: false })
  username: string;

  /**
   * 邮箱地址
   */
  @ApiProperty({
    description: '邮箱地址',
    example: 'zhangsan@example.com',
    required: true,
  })
  @Column({ unique: true, nullable: false })
  email: string;

  /**
   * 密码哈希
   */
  @ApiProperty({
    description: '密码哈希',
    required: true,
    writeOnly: true,
  })
  @Column({ nullable: false })
  passwordHash: string;

  /**
   * 用户角色
   */
  @ApiProperty({
    description: '用户角色',
    example: 'user',
    default: 'user',
  })
  @Column({ default: 'user' })
  role: string;

  /**
   * 用户状态
   */
  @ApiProperty({
    description: '用户状态',
    example: 'active',
    default: 'active',
  })
  @Column({ default: 'active' })
  status: string;

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
   * 用户拥有的菜单权限
   */
  @ApiProperty({
    description: '用户拥有的菜单权限列表',
    type: () => [Menu],
    required: false,
  })
  @ManyToMany(() => Menu, (menu) => menu.users)
  menus: Menu[];
}
