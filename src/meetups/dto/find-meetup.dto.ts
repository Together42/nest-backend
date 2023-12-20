import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindMeetupParam {
  @ApiProperty()
  @Transform((params) => +params.value)
  @IsNumber()
  id: number;
}

export class FindMeetupDto extends FindMeetupParam {}
