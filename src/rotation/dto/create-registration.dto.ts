import { IsArray, IsDefined, IsNumber } from 'class-validator';

export class CreateRegistrationDto {
  @IsDefined()
  @IsArray()
  @IsNumber({}, { each: true })
  attendLimit: JSON;
}
