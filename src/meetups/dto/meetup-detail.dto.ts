import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { MeetupDto } from './meetup.dto';
import { MeetupEntity } from '../entity/meetup.entity';
import { MeetupAttendeeEntity } from '../entity/meetup-attendee.entity';

export class MeetupAttendeeDto {
  @ApiProperty({ description: '이벤트에 신청한 유저의 닉네임' })
  intraId: string;

  @ApiProperty({ description: '이벤트에 신청한 유저의 프로필 사진' })
  profile: string;

  @ApiProperty({
    type: Number,
    description: '이벤트에 신청한 유저의 팀',
    nullable: true,
  })
  teamId: number | null;

  static from(meetupAttendeeEntity: MeetupAttendeeEntity) {
    const meetupAttendeeDto = new MeetupAttendeeDto();
    meetupAttendeeDto.intraId = meetupAttendeeEntity.user?.nickname;
    meetupAttendeeDto.profile = meetupAttendeeEntity.user?.profileImageUrl;
    meetupAttendeeDto.teamId = meetupAttendeeEntity.teamId;
    return meetupAttendeeDto;
  }
}

@ApiExtraModels(MeetupAttendeeDto)
export class MeetupDetailDto {
  @ApiProperty({ type: MeetupDto, description: '이벤트 정보' })
  event: MeetupDto;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'array',
      items: { $ref: getSchemaPath(MeetupAttendeeDto) },
    },
    description: '매칭된 팀 리스트',
  })
  teamList: { [x: string]: MeetupAttendeeDto[] };

  static from(meetupEntity: MeetupEntity) {
    const { attendees } = meetupEntity;
    const meetupDetailDto = new MeetupDetailDto();
    meetupDetailDto.event = MeetupDto.from(meetupEntity);

    const teams: { [x: string]: MeetupAttendeeDto[] } = {};
    meetupDetailDto.teamList = attendees.reduce((accumulate, attendee) => {
      const key = attendee.teamId ? `${attendee.teamId}` : 'null';
      if (!accumulate[key]) {
        accumulate[key] = [];
      }
      accumulate[key].push(MeetupAttendeeDto.from(attendee));
      return accumulate;
    }, teams);
    return meetupDetailDto;
  }
}
