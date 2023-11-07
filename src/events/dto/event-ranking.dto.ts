import { ApiProperty } from '@nestjs/swagger';

export class EventRankingDto {
  @ApiProperty({ description: '유저의 고유 아이디' })
  userId: number;

  @ApiProperty({ description: '유저의 닉네임' })
  intraId: string;

  @ApiProperty({ description: '유저의 프로필 이미지' })
  profile: string;

  @ApiProperty({ description: '유저의 총 포인트' })
  totalPoint: number;

  @ApiProperty({ description: '유저의 로테이션 참여 횟수' })
  rotationPoint: number;

  @ApiProperty({ description: '유저의 이벤트 참여 횟수' })
  eventPoint: number;
}
