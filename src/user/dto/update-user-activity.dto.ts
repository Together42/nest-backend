import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserActivityByIdDto {
  @ApiProperty({ description: '유저의 고유 아이디' })
  userId: number;

  @ApiProperty({ description: '유저의 활동 여부' })
  isActive: boolean;
}

export class UpdateUserActivityByNameDto {
  @ApiProperty({ description: '유저의 닉네임' })
  nickname: string;

  @ApiProperty({ description: '유저의 활동 여부' })
  isActive: boolean;
}
