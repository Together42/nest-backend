import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class MatchMeetupBody {
  @ApiPropertyOptional({
    description: '참석자를 몇 개의 팀으로 나눌 건지',
    minimum: 1,
    default: 1,
  })
  @Transform((params) => params.value ?? 1)
  @IsOptional()
  @IsNumber()
  @Min(1)
  teamNum: number = 1;
}

export class MatchMeetupDto extends MatchMeetupBody {
  meetupId: number;
  userId?: number;
}
