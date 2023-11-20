import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetupAttendeeEntity } from './meetup-attendee.entity';
import { MeetupCategory } from '../enum/meetup-category.enum';
import { UserEntity } from './user.entity';

@Entity('meetup')
export class MeetupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'create_user_id', default: null })
  createUserId: number;

  @Column({ name: 'match_user_id', default: null })
  matchUserId: number;

  @Column({ name: 'delete_user_id', default: null })
  deleteUserId: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 255 })
  description: string;

  @Column({ name: 'category_id', default: MeetupCategory.ETC })
  categoryId: MeetupCategory;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({
    name: 'matched_at',
    type: 'timestamp',
    default: null,
    precision: 6,
  })
  matchedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'create_user_id' })
  createUser: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'match_user_id' })
  matchUser: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'delete_user_id' })
  deleteUser: UserEntity;

  @OneToMany(
    () => MeetupAttendeeEntity,
    (meetupAttendee) => meetupAttendee.meetup,
  )
  attendees: MeetupAttendeeEntity[];
}
