import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsNumber } from 'class-validator';

export class CreateRegistrationDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: '신청자가 참여하지 못한다고 선택한 다음 달 사서 업무 일정이 담긴 배열',
  })
  @IsDefined()
  @IsArray()
  @IsNumber({}, { each: true })
  attendLimit: JSON;
}
