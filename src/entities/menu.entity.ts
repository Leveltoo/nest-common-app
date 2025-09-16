import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 菜单实体类
 * 表示系统中的菜单结构和权限配置
 */
@Entity('menus')
export class Menu {
  /**
   * 菜单唯一标识符
   */
  @ApiProperty({
    description: '菜单唯一标识符',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * 菜单名称
   */
  @ApiProperty({
    description: '菜单名称',
    example: '用户管理',
    required: true,
  })
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  /**
   * 菜单路径
   */
  @ApiProperty({
    description: '菜单路径',
    example: '/users',
    required: true,
  })
  @Column({ type: 'varchar', length: 100, nullable: false })
  path: string;

  /**
   * 菜单组件
   */
  @ApiProperty({
    description: '菜单组件路径',
    example: 'UserManagement',
    required: true,
  })
  @Column({ type: 'varchar', length: 100, nullable: false })
  component: string;

  /**
   * 菜单图标
   */
  @ApiProperty({
    description: '菜单图标',
    example: 'user',
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  icon?: string;

  /**
   * 父菜单ID
   */
  @ApiProperty({
    description: '父菜单ID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    required: false,
  })
  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  /**
   * 父菜单
   */
  @ManyToOne(() => Menu, (menu) => menu.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent?: Menu;

  /**
   * 子菜单列表
   */
  @OneToMany(() => Menu, (menu) => menu.parent)
  children?: Menu[];

  /**
   * 菜单排序
   */
  @ApiProperty({
    description: '菜单排序',
    example: 1,
    default: 0,
  })
  @Column({ default: 0 })
  sort: number;

  /**
   * 菜单类型
   */
  @ApiProperty({
    description: '菜单类型',
    example: 'menu',
    enum: ['menu', 'button', 'link'],
    default: 'menu',
  })
  @Column({ type: 'varchar', length: 20, default: 'menu' })
  type: string;

  /**
   * 权限码
   */
  @ApiProperty({
    description: '权限码',
    example: 'user:manage',
    required: false,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  permissionCode?: string;

  /**
   * 是否显示
   */
  @ApiProperty({
    description: '是否显示在菜单中',
    example: true,
    default: true,
  })
  @Column({ default: true })
  show: boolean;

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
   * 可访问此菜单的用户角色
   */
  @ApiProperty({
    description: '可访问此菜单的用户角色列表',
    type: () => [String],
  })
  @Column('simple-array', { nullable: true })
  roles: string[];

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
   * 拥有此菜单权限的用户
   */
  @ManyToMany(() => User, (user) => user.menus)
  @JoinTable({
    name: 'user_menus',
    joinColumn: { name: 'menu_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  users: User[];
}
