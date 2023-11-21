import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user.entity';

@Entity('rotation')
export class Rotation {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  // eager: Rotation entity와 함께 User entity도 로드되도록 한다.
  @ManyToOne(() => User, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column('int', { name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'update_user_id', referencedColumnName: 'id' })
  updateUser: User;

  @Column('int', { name: 'update_user_id' })
  updateUserId: number;

  @Column('smallint')
  year: number;

  @Column('tinyint')
  month: number;

  @Column('tinyint')
  day: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;
}
