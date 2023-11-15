import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BatchService } from './batch.service';
import { EventsService } from 'src/events/events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from 'src/events/entities/event.entity';
import { EventAttendeeEntity } from 'src/events/entities/event-attendee.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([EventEntity, EventAttendeeEntity]),
  ],
  providers: [BatchService, EventsService],
})
export class BatchModule {}
