import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RotationEntity } from './entity/rotation.entity';
import { RotationAttendeeEntity } from './entity/rotation-attendee.entity';
import { RotationsService } from './rotations.service';
import { RotationsController } from './rotations.controller';
import { CustomRotationRepository } from './rotations.repository';
import { RotationHolidayEntity } from '../holiday/entity/holiday.entity';
import { HolidayService } from '../holiday/holiday.service';
import { HolidayRepository } from '../holiday/holiday.repository';
import { HolidayModule } from '../holiday/holiday.module';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/repository/user.repository';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RotationEntity,
      RotationAttendeeEntity,
      RotationHolidayEntity,
      User,
    ]),
    ScheduleModule.forRoot(),
    UserModule,
    HolidayModule,
  ],
  controllers: [RotationsController],
  providers: [
    UserService,
    UserRepository,
    RotationsService,
    CustomRotationRepository,
    HolidayService,
    HolidayRepository,
  ],
})
export class RotationsModule {}
