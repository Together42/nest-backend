import { IsArray, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRotationDto {
  @IsDefined()
  @IsArray()
  @IsNumber({}, { each: true })
  attendDate: JSON;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsNumber()
  month: number;
}
