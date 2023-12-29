// import { PartialType } from '@nestjs/mapped-types';
// import { CreateRotationDto } from './create-rotation.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRotationDto {
  @ApiProperty({
    example: [25],
    description:
      '변경하고자 하는 유저의 기존 사서 업무 일정의 일이 담긴 배열. DB에서 JSON 타입으로 저장되어야 해서 개수와 상관 없이 JSON 배열 형태를 가집니다.',
  })
  @IsDefined()
  @ArrayNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  attendDate: JSON;

  @ApiProperty({
    example: [14],
    description:
      '변경하고자 하는 유저의 변경된 사서 업무 일정의 일이 담긴 배열. DB에서 JSON 타입으로 저장되어야 해서 개수와 상관 없이 JSON 배열 형태를 가집니다.',
  })
  @IsNotEmpty()
  @IsNumber()
  updateDate: number;

  @ApiProperty({
    example: 2024,
    description: '변경하고자 하는 유저의 변경된 일정의 연도',
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    example: 1,
    description: '변경하고자 하는 유저의 변경된 일정의 월',
  })
  @IsNotEmpty()
  @IsNumber()
  month: number;
}
