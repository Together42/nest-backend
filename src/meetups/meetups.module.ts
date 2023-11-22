import { Module } from '@nestjs/common';
import { MeetupsController } from './meetups.controller';
import { MeetupsService } from './meetups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetupEntity } from './entity/meetup.entity';
import { MeetupAttendeeEntity } from './entity/meetup-attendee.entity';
import { MeetupEventsHandler } from './meetup.events-handler';

@Module({
  imports: [TypeOrmModule.forFeature([MeetupEntity, MeetupAttendeeEntity])],
  controllers: [MeetupsController],
  providers: [MeetupsService, MeetupEventsHandler],
  exports: [MeetupsService],
})
export class MeetupsModule {}
