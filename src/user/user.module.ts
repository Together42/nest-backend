import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { UserEntity } from './entity/user.entity';
import { RotationsService } from '../rotation/rotations.service';
import { RotationEntity } from 'src/rotation/entity/rotation.entity';
import { RotationAttendeeEntity } from 'src/rotation/entity/rotation-attendee.entity';
import { RotationRepository } from 'src/rotation/repository/rotations.repository';
import { RotationAttendeeRepository } from 'src/rotation/repository/rotation-attendees.repository';
import { HolidayModule } from 'src/holiday/holiday.module';
import { SlackModule } from 'src/slack/slack.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RotationEntity, RotationAttendeeEntity]),
    HolidayModule,
    SlackModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RotationsService,
    RotationRepository,
    RotationAttendeeRepository,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
