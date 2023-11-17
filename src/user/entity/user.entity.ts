import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  googleEmail: string;

  @Column({ nullable: false, unique: true })
  nickname: string;

  // @Column({ nullable: true })
  // slackMemberId: string;

  // @Column({ nullable: true })
  // profile: string;

  // @Column({ nullable: false})
  // role: number;

  // @Column({ nullable: false })
  // isActive: boolean;

  @Column({ nullable: false })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
