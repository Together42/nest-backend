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
  @ManyToOne(() => User, (user) => user.rotations, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column('int')
  userId: number;

  @ManyToOne(() => User, (user) => user.id, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'updateUserId', referencedColumnName: 'id' })
  updateUser: number;

  @Column('int')
  updateUserId: number;

  @Column('smallint')
  year: number;

  @Column('tinyint')
  month: number;

  @Column('tinyint')
  day: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deleted_at: Date;
}
