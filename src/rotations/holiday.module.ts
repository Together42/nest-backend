import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RotationHoliday } from './entities/holiday/holiday.entity';
import { HolidayService } from './holiday.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RotationHoliday]),
    ScheduleModule.forRoot(),
  ],
  providers: [HolidayService],
  exports: [HolidayService],
})
export class HolidayModule {}
