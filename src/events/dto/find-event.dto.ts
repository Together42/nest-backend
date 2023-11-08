import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { EventAttendeeDto } from './event-attendee.dto';
import { EventDto } from './event.dto';

export class FindEventDto {
  @ApiProperty({ type: EventDto, description: '이벤트 정보' })
  event: EventDto;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { $ref: getSchemaPath(EventAttendeeDto) },
    },
    description: '매칭된 팀 리스트',
  })
  teamList: { [x: string]: [EventAttendeeDto] } | null;
}
