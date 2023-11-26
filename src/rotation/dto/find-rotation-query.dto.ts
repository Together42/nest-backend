import { IsNumber, IsOptional } from 'class-validator';

export class FindRotationQueryDto {
  @IsOptional()
  @IsNumber()
  month?: number;

  @IsOptional()
  @IsNumber()
  year?: number;
}
