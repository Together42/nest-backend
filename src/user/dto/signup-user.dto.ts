import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SignUpUserDto {
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  @IsOptional()
  @IsString()
  readonly slackId: string;

  @IsNotEmpty()
  @IsString()
  readonly imageUrl: string;
}
