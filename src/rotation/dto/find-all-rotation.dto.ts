import { IsInt, IsDate, IsOptional } from 'class-validator';

export class FindAllRotationDto {
  @IsInt()
  userId: number;

  @IsInt()
  updateUserId: number;

  @IsInt()
  year: number;

  @IsInt()
  month: number;

  @IsInt()
  day: number;

  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  deletedAt: Date;

  intraId: string;
}