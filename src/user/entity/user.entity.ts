import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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

  // @Column({ nullable: true })
  // slackMemberId: string;

  // @Column({ nullable: true })
  // profile: string;

  @Column({ nullable: false, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
