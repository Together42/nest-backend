import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Rotation } from './entities/rotation/rotation.entity';
import { RotationAttendee } from './entities/rotation/rotation-attendee.entity';
import { RotationsService } from './rotations.service';
import { RotationsController } from './rotations.controller';
/* for test */ import { User } from './entities/user.entity';
import { CustomRotationRepository } from './rotations.repository';
import { RotationHoliday } from './entities/holiday/holiday.entity';
import { HolidayService } from './holiday.service';
import { HolidayRepository } from './holiday.repository';
import { HolidayModule } from './holiday.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rotation,
      RotationAttendee,
      User,
      RotationHoliday,
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
