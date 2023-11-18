import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { EventDto } from './event.dto';
import { EventEntity } from '../entities/event.entity';
import { EventAttendeeEntity } from '../entities/event-attendee.entity';

class EventAttendeeDto {
  @ApiProperty({ description: '이벤트에 신청한 유저의 닉네임' })
  intraId: string;

  @ApiProperty({ description: '이벤트에 신청한 유저의 프로필 사진' })
  url: string;

  @ApiProperty({
    type: Number,
    description: '이벤트에 신청한 유저의 팀',
    nullable: true,
  })
  teamId: number | null;

  static from(eventAttendeeEntity: EventAttendeeEntity) {
    const eventAttendeeDto = new EventAttendeeDto();
    eventAttendeeDto.intraId = `${eventAttendeeEntity.userId}`;
    eventAttendeeDto.url = `${eventAttendeeEntity.userId}`;
    eventAttendeeDto.teamId = eventAttendeeEntity.teamId;
    return eventAttendeeDto;
  }
}

@ApiExtraModels(EventAttendeeDto)
export class EventDetailDto {
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
  teamList: { [x: string]: EventAttendeeDto[] };

  static from(eventEntity: EventEntity) {
    const { attendees } = eventEntity;
    const eventDetailDto = new EventDetailDto();
    eventDetailDto.event = EventDto.from(eventEntity);

    const teams: { [x: string]: EventAttendeeDto[] } = {};
    eventDetailDto.teamList = attendees.reduce((accumulate, attendee) => {
      const key = attendee.teamId ? `${attendee.teamId}` : 'null';
      if (!accumulate[key]) {
        accumulate[key] = [];
      }
      accumulate[key].push(EventAttendeeDto.from(attendee));
      return accumulate;
    }, teams);
    return eventDetailDto;
  }
}
