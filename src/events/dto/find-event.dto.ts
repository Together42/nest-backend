import { ApiProperty } from '@nestjs/swagger';

export class FindEventParam {
  @ApiProperty()
  id: number;
}

export class FindEventDto extends FindEventParam {}
