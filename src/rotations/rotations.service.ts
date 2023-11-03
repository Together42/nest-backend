import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { Rotation } from './entities/rotation.entity';

@Injectable()
export class RotationsService {
  create(createRotationDto: CreateRotationDto) {
    return 'This action adds a new rotation';
  }

  findAll() {
    return `This action returns all rotations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rotation`;
  }

  update(id: number, updateRotationDto: UpdateRotationDto) {
    return `This action updates a #${id} rotation`;
  }

  remove(id: number) {
    return `This action removes a #${id} rotation`;
  }
}
