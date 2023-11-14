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
import { User } from './user.entity';

@Entity('rotation_attendee')
export class RotationAttendee {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('int')
    userId: number;

    @Column('smallint')
    year: number;

    @Column('tinyint')
    month: number;

    @Column('json')
    attend_limit: JSON;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'datetime' })
    deleted_at: Date;
}