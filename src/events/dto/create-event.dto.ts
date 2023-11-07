import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: '이벤트 제목 (최대 50자)' })
  title: string;

  @ApiProperty({ description: '이벤트 설명 (최대 255자)' })
  description: string;
}
