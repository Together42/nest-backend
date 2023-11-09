import { ApiProperty } from '@nestjs/swagger';

export class FindOneParam {
  @ApiProperty()
  id: number;
}
