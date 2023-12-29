import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRotationDto {
  @ApiProperty({
    example: [25],
    description:
      '신청자가 참여하고자 하는 일정의 일이 담긴 배열. DB에서 JSON 타입으로 저장되어야 해서 개수와 상관 없이 JSON 배열 형태를 가집니다.',
  })
  @IsDefined()
  @IsArray()
  @IsNumber({}, { each: true })
  attendDate: JSON;

  @ApiProperty({
    example: 2024,
    description: '신청자가 참여하고자 하는 연도',
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    example: 1,
    description: '신청자가 참여하고자 하는 월',
  })
  @IsNotEmpty()
  @IsNumber()
  month: number;
}
