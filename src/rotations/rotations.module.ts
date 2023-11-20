import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Rotation } from './entities/rotation/rotation.entity';
import { RotationAttendee } from './entities/rotation/rotation-attendee.entity';
import { RotationsService } from './rotations.service';
import { RotationsController } from './rotations.controller';
/* for test */ import { User } from './entities/user.entity';
import { RotationRepository } from './rotations.repository';
import { RotationHoliday } from './entities/holiday/holiday.entity';
import { HolidayService } from './holiday.service';
import { HolidayRepository } from './holiday.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rotation,
      RotationAttendee,
      User,
      RotationHoliday,
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [RotationsController],
  providers: [
    RotationsService,
    RotationRepository,
    HolidayService,
    HolidayRepository,
  ],
})
export class RotationsModule {}
