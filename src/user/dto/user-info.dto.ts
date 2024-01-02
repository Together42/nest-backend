import { ApiProperty } from '@nestjs/swagger';
import UserRole from '../enum/user.enum';

export class UserInfoDto {
  @ApiProperty({ description: '유저의 고유 아이디'})
  id: number;

  @ApiProperty({ description: '유저의 닉네임 (인트라 아이디)'})
  username: string;

  @ApiProperty({ description: '유저의 권한', enum: UserRole})
  role: UserRole;

  @ApiProperty({ description: '유저의 프로필 이미지'})
  imageUrl: string;

  @ApiProperty({ description: '토큰 발급 시각 (로그인한 시각)'})
  iat: number;

  @ApiProperty({ description: '토큰 만료 시각 (강제 로그아웃 시각)'})
  exp: number;
}
