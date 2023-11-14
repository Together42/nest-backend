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

@Entity('rotation')
export class Rotation {
    @PrimaryGeneratedColumn()
    id: number;

    // eager: Rotation entity와 함께 User entity도 로드되도록 한다.
    @ManyToOne(() => User, (user) => user.id, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('int')
    userId: number;

    @ManyToOne(() => User, (user) => user.id, { eager: true })
    @JoinColumn({ name: 'update_user_id' })
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

    @CreateDateColumn({ type: 'datetime' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'datetime' })
    deleted_at: Date;
}