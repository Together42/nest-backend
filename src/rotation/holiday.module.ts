import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RotationHolidayEntity } from './entities/holiday/holiday.entity';
import { HolidayService } from './holiday.service';
import { HolidayRepository } from './holiday.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RotationHolidayEntity]),
    ScheduleModule.forRoot(),
  ],
  providers: [HolidayService, HolidayRepository],
  exports: [HolidayService],
})
export class HolidayModule {}
