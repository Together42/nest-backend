import { PartialType } from '@nestjs/mapped-types';
import { CreateRotationDto } from './create-rotation.dto';

export class UpdateRotationDto extends PartialType(CreateRotationDto) {}
