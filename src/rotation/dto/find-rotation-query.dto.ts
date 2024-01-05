import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class FindRotationQueryDto {
  @ApiProperty({
    example: 1,
    description: '로테이션 정보를 찾는 기준이 되는 월. 기본값은 다음 달 월입니다.',
  })
  @IsOptional()
  @IsNumber()
  month?: number;

  @ApiProperty({
    example: 2024,
    description: '로테이션 정보를 찾는 기준이 되는 연도. 기본값은 다음 달 연도입니다.',
  })
  @IsOptional()
  @IsNumber()
  year?: number;
}
