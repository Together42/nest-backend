import { ApiPropertyOptional } from '@nestjs/swagger';

export class MatchEventBody {
  @ApiPropertyOptional({
    description: '참석자를 몇 개의 팀으로 나눌 건지',
    minimum: 1,
    default: 1,
  })
  teamNum: number;
}

export class MatchEventDto extends MatchEventBody {
  eventId: number;
  userId: number;
}
