import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { EventDto } from './event.dto';

export class EventAttendeeDto {
  @ApiProperty({ description: '이벤트에 신청한 유저의 닉네임' })
  intraId: string;

  @ApiProperty({ description: '이벤트에 신청한 유저의 닉네임' })
  url: string;

  @ApiProperty({
    type: Number,
    description: '이벤트에 신청한 유저의 팀',
    nullable: true,
  })
  teamId: number | null;
}

@ApiExtraModels(EventAttendeeDto)
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
