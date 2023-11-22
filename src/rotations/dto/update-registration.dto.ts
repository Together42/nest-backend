import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrationDto } from './create-registration.dto';

export class UpdateRegistrationDto extends PartialType(CreateRegistrationDto) {}
