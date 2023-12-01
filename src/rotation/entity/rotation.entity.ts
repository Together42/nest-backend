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
import { UserEntity } from 'src/user/entity/user.entity';

@Entity('rotation')
export class RotationEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  // eager: Rotation entity와 함께 User entity도 로드되도록 한다.
  @ManyToOne(() => UserEntity, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column('int', { name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'update_user_id', referencedColumnName: 'id' })
  updateUser: UserEntity;

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
