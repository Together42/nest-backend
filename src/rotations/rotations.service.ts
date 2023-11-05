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

  async create(createRotationDto: CreateRotationDto) {
    const { user_id } = createRotationDto;

    const userInfo = this.userRepository.create({
      nickname: user_id,
    });

    await this.userRepository.save(userInfo);

    return userInfo;
  //  return 'This action adds a new rotation';
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
