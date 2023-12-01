import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpUserDto {
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;

  @IsString()
  readonly slackId: string;
}
