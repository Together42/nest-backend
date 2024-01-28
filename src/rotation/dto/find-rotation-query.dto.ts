import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class FindRotationQueryDto {
  private currentDate = new Date();

  @Transform((params) => +params.value)
  @ApiProperty({
    required: false,
    example: 1,
    description: '로테이션 정보를 찾는 기준이 되는 월. 기본값은 다음 달 월입니다.',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  month?: number = this.currentDate.getMonth() + 1;

  @Transform((params) => +params.value)
  @ApiProperty({
    required: false,
    example: 2024,
    description: '로테이션 정보를 찾는 기준이 되는 연도. 기본값은 다음 달 연도입니다.',
  })
  @IsOptional()
  @IsNumber()
  @Min(2020)
  @Max(2100)
  year?: number = this.currentDate.getFullYear();
}
