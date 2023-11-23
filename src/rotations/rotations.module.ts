import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RotationEntity } from './entities/rotation/rotation.entity';
import { RotationAttendeeEntity } from './entities/rotation/rotation-attendee.entity';
import { RotationsService } from './rotations.service';
import { RotationsController } from './rotations.controller';
import { CustomRotationRepository } from './rotations.repository';
import { RotationHolidayEntity } from './entities/holiday/holiday.entity';
import { HolidayService } from './holiday.service';
import { HolidayRepository } from './holiday.repository';
import { HolidayModule } from './holiday.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RotationEntity,
      RotationAttendeeEntity,
      RotationHolidayEntity,
    ]),
    ScheduleModule.forRoot(),
    HolidayModule,
  ],
  controllers: [RotationsController],
  providers: [
    RotationsService,
    CustomRotationRepository,
    HolidayService,
    HolidayRepository,
  ],
})
export class RotationsModule {}
