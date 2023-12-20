// import { PartialType } from '@nestjs/mapped-types';
// import { CreateRotationDto } from './create-rotation.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class UpdateRotationDto {
  @IsDefined()
  @ArrayNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  attendDate: JSON;

  @IsNotEmpty()
  @IsNumber()
  updateDate: number;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsNumber()
  month: number;
}
