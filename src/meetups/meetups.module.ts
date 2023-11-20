import { Module } from '@nestjs/common';
import { MeetupsController } from './meetups.controller';
import { MeetupsService } from './meetups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetupEntity } from './entity/meetup.entity';
import { MeetupAttendeeEntity } from './entity/meetup-attendee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetupEntity, MeetupAttendeeEntity])],
  controllers: [MeetupsController],
  providers: [MeetupsService],
  exports: [MeetupsService],
})
export class MeetupsModule {}
