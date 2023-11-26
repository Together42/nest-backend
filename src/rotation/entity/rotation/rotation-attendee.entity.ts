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
import { User } from 'src/user/entity/user.entity';

@Entity('rotation_attendee')
export class RotationAttendeeEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.id, {
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // 설정 안하면 PK로 자동 매핑됨
  user: User;

  @Column('int')
  userId: number;

  @Column('smallint')
  year: number;

  @Column('tinyint')
  month: number;

  @Column('json')
  attendLimit: JSON;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;
}
