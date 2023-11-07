import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { Rotation } from './entities/rotation.entity';
import { RotationAttendee } from './entities/rotation_attendee.entity';
/* for test */ import { User } from './entities/user.entity';

@Injectable()
export class RotationsService {
  constructor(
    @InjectRepository(Rotation)
    private rotationRepository: Repository<Rotation>,
    @InjectRepository(RotationAttendee)
    private attendeeRepository: Repository<RotationAttendee>,
    /* for test */
    @InjectRepository(User)
    private userRepository: Repository<User>,
    /* ******** */
  ) {}

  async createRotation(createRotationDto: CreateRotationDto) {
    return 'This action adds a new rotation';
  }

  async findAllRotation() {
    return `This action returns all rotations`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} rotation`;
  // }

  async updateRotation(id: number, updateRotationDto: UpdateRotationDto) {
    return `This action updates a #${id} rotation`;
  }

  async removeRotation(id: number) {
    return `This action removes a #${id} rotation`;
  }

  async createRegistration(createRotationDto: CreateRotationDto) {
    return 'This action adds a new rotation';
  }

  async findAllRegistration() {
    return `This action returns all rotations`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} rotation`;
  // }

  // updateRegistration(id: number, updateRotationDto: UpdateRotationDto) {
  //   return `This action updates a #${id} rotation`;
  // }

  async removeRegistration(id: number) {
    return `This action removes a #${id} rotation`;
  }
}
