import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetupEntity } from './meetup.entity';
import { User } from 'src/user/entity/user.entity';

@Entity('meetup_attendee')
export class MeetupAttendeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'meetup_id' })
  meetupId: number;

  @Column({ name: 'team_id', default: null })
  teamId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => MeetupEntity, (meetup) => meetup.attendees)
  @JoinColumn({ name: 'meetup_id' })
  meetup: MeetupEntity;
}
