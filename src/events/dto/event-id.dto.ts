import { ApiProperty } from '@nestjs/swagger';

export class EventIdDto {
  @ApiProperty({ description: '생성된 이벤트 아이디', example: 42 })
  eventId: number;
}
