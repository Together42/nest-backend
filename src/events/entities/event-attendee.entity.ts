import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { EventEntity } from './event.entity';

@Entity('event_attendee')
export class EventAttendeeEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'event_id' })
  eventId: number;

  @Column({ name: 'team_id' })
  teamId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => EventEntity, (event) => event.eventAttendees)
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;
}
