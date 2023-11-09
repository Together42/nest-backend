import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventAttendeeEntity } from './event-attendee.entity';

@Entity('event')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'create_user_id', default: null })
  createUserId: number;

  @Column({ name: 'match_user_id', default: null })
  matchUserId: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 255 })
  description: string;

  @Column({ name: 'matched_at', type: 'timestamp', default: null })
  matchedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => EventAttendeeEntity, (eventAttendee) => eventAttendee.event)
  eventAttendees: EventAttendeeEntity[];
}
