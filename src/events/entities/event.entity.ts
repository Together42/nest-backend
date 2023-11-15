import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventAttendeeEntity } from './event-attendee.entity';
import { EventCategory } from '../enum/event-category.enum';

@Entity('event')
export class EventEntity {
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

  @Column({ name: 'category_id', default: EventCategory.ETC })
  categoryId: EventCategory;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'matched_at', type: 'timestamp', default: null })
  matchedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @OneToMany(() => EventAttendeeEntity, (eventAttendee) => eventAttendee.event)
  attendees: EventAttendeeEntity[];
}
