import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDate, IsOptional } from 'class-validator';

export class FindAllRotationDto {
  @ApiProperty({
    example: 1,
    description: '사용자 ID',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 1,
    description: '정보를 업데이트한 유저의 ID',
  })
  @IsInt()
  updateUserId: number;

  @ApiProperty({
    example: 2021,
    description: '사서 일정의 연도',
  })
  @IsInt()
  year: number;

  @ApiProperty({
    example: 1,
    description: '사서 일정의 월',
  })
  @IsInt()
  month: number;

  @ApiProperty({
    example: 1,
    description: '사서 일정의 일',
  })
  @IsInt()
  day: number;

  @ApiProperty({
    example: 1,
    description: '사서 일정의 생성 시간',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: 1,
    description: '사서 일정의 업데이트 시간',
  })
  @IsOptional()
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    example: 1,
    description: '사서 일정의 삭제 시간',
  })
  @IsOptional()
  @IsDate()
  deletedAt: Date;

  @ApiProperty({
    example: 1,
    description: '해당 사서 일정에 참여하는 사서의 닉네임',
  })
  intraId: string;
}
