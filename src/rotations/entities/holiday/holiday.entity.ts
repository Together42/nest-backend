import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rotation_holiday')
export class RotationHoliday {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('smallint')
  year: number;

  @Column('tinyint')
  month: number;

  @Column('tinyint')
  day: number;

  @Column({ length: 50 })
  info: string;
}
