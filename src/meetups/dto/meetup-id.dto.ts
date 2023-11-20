import { ApiProperty } from '@nestjs/swagger';

export class MeetupIdDto {
  @ApiProperty({ description: '생성된 이벤트 아이디', example: 42 })
  meetupId: number;
}
