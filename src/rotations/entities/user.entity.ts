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
import { RotationAttendee } from './rotation-attendee.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    @OneToMany(() => Rotation, (rotation) => rotation.user, { eager: false })
    @OneToMany(() => Rotation, (rotation) => rotation.updateUser, { eager: false })
    @OneToMany(() => RotationAttendee, (RotationAttendee) => RotationAttendee.user, { eager: false })
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