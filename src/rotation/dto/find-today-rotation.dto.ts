import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FindTodayRotationDto {
  @ApiProperty({
    example: 1,
    description: '오늘 사서 업무를 맡은 사서의 닉네임입니다.',
  })
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    example: 2024,
    description: '오늘 사서 업무를 맡은 사서의 슬랙 ID입니다.',
  })
  slackMemberId: string;
}
