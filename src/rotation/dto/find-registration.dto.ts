import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FindRegistrationDto {
  @ApiProperty({
    example: 2024,
    description: '유저 본인의 다음 달 로테이션 날짜의 연도',
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    example: 1,
    description: '유저 본인의 다음 달 로테이션 날짜의 달',
  })
  @IsNotEmpty()
  @IsNumber()
  month: number;

  @ApiProperty({
    example: 1,
    description: '유저 본인이 선택한 다음 달 로테이션 불가능 일자',
  })
  @IsNotEmpty()
  attendLimit: JSON;

  @ApiProperty({
    example: 1,
    description: '유저 본인의 인트라 ID(닉네임)',
  })
  @IsNotEmpty()
  intraId: string;

}
