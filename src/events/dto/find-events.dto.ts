import { ApiProperty } from '@nestjs/swagger';
import { EventDto } from './event.dto';

export class FindEventsDto {
  @ApiProperty({ type: [EventDto], description: '전체 이벤트 목록' })
  eventList: EventDto[];
}
