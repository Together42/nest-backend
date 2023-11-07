import { ApiPropertyOptional } from '@nestjs/swagger';

export class MatchEventDto {
  @ApiPropertyOptional({
    description: '참석자를 몇 개의 팀으로 나눌 건지',
    minimum: 1,
    default: 1,
  })
  teamNum?: number;
}
