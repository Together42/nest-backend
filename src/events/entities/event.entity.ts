import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventAttendeeEntity } from './event-attendee.entity';

@Entity('event')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'create_user_id' })
  createUserId: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 255 })
  description: string;

  @Column({ name: 'matched_at', type: 'timestamp' })
  matchedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => EventAttendeeEntity, (eventAttendee) => eventAttendee.event)
  eventAttendees: EventAttendeeEntity[];
}
