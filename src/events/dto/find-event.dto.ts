import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindEventParam {
  @ApiProperty()
  @Transform((params) => +params.value)
  @IsNumber()
  id: number;
}

export class FindEventDto extends FindEventParam {}
