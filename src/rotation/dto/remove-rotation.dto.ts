import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class RemoveRotationQueryDto {
  @ApiProperty({
    example: 25,
    description: '로테이션 정보를 삭제하는 기준이 되는 일',
  })
  @IsNotEmpty()
  @IsNumber()
  day: number;

  @ApiProperty({
    example: 1,
    description:
      '로테이션 정보를 삭제하는 기준이 되는 월. 기본값은 다음 달 월이지만 값을 적는 것을 권장합니다.',
  })
  @IsOptional()
  @IsNumber()
  month?: number;

  @ApiProperty({
    example: 2024,
    description:
      '로테이션 정보를 삭제하는 기준이 되는 연도. 기본값은 다음 달 연도이지만 값을 적는 것을 권장합니다.',
  })
  @IsOptional()
  @IsNumber()
  year?: number;
}
