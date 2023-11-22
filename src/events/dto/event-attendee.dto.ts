import { ApiProperty } from '@nestjs/swagger';

export class EventAttendeeDto {
  @ApiProperty({ description: '이벤트에 신청한 유저의 닉네임' })
  intraId: string;

  @ApiProperty({ description: '이벤트에 신청한 유저의 닉네임' })
  url: string;

  @ApiProperty({ description: '이벤트에 신청한 유저의 팀' })
  teamId: number | null;
}
