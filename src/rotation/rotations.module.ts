import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RotationsService } from './rotations.service';
import { RotationsController } from './rotations.controller';
import { RotationRepository } from './repository/rotations.repository';
import { HolidayModule } from '../holiday/holiday.module';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/repository/user.repository';
import { RotationAttendeeRepository } from './repository/rotation-attendees.repository';
import { RotationEntity } from './entity/rotation.entity';
import { RotationAttendeeEntity } from './entity/rotation-attendee.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { SlackModule } from 'src/slack/slack.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RotationEntity, RotationAttendeeEntity, UserEntity]),
    ScheduleModule.forRoot(),
    HolidayModule,
    SlackModule,
  ],
  controllers: [RotationsController],
  providers: [
    RotationsService,
    RotationRepository,
    RotationAttendeeRepository,
    UserService,
    UserRepository,
  ],
  exports: [RotationsService, RotationRepository, RotationAttendeeRepository],
})
export class RotationsModule {}
