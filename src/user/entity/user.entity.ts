import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserRole from '../enum/user.enum';

@Entity({})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  googleEmail: string;

  @Column({ nullable: false, unique: true })
  nickname: string;

  @Column({ nullable: false })
  googleID: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  slackMemberId: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: false, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
