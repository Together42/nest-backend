/* *****************
 * TEST USER ENTITY
 * *****************/

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
} from 'typeorm';
import { Rotation } from './rotation.entity';
import { RotationAttendee } from './rotation_attendee.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    @OneToMany(() => Rotation, (rotation) => rotation.user, { eager: true })
    @OneToMany(() => Rotation, (rotation) => rotation.update_user, { eager: true })
    @OneToMany(() => RotationAttendee, (RotationAttendee) => RotationAttendee.user, { eager: true })
    id: number;

    @Column({ length: 255 })
    nickname: string;

    @CreateDateColumn({ type: 'datetime' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'datetime' })
    deleted_at: Date;
}