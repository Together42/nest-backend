import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class RemoveRotationQueryDto {
  @IsNotEmpty()
  @IsNumber()
  day: number;

  @IsOptional()
  @IsNumber()
  month?: number;

  @IsOptional()
  @IsNumber()
  year?: number;
}
