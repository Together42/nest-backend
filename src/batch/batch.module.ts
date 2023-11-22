import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchService } from './batch.service';
import { MeetupsService } from 'src/meetups/meetups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetupEntity } from 'src/meetups/entity/meetup.entity';
import { MeetupAttendeeEntity } from 'src/meetups/entity/meetup-attendee.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([MeetupEntity, MeetupAttendeeEntity]),
  ],
  providers: [BatchService, MeetupsService],
})
export class BatchModule {}
