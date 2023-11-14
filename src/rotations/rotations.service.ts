import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { Rotation } from './entities/rotation.entity';
import { RotationAttendee } from './entities/rotation-attendee.entity';
/* for test */ import { User } from './entities/user.entity';
import { getFourthWeekdaysOfMonth, getNextYearAndMonth, getTodayDate } from './utils/date.helper';

@Injectable()
export class RotationsService {
  private readonly logger = new Logger(RotationsService.name);

  constructor(
    @InjectRepository(Rotation)
    private rotationRepository: Repository<Rotation>,
    @InjectRepository(RotationAttendee)
    private attendeeRepository: Repository<RotationAttendee>,
    
    /****  for test  ****/
    @InjectRepository(User)
    private userRepository: Repository<User>,
    /********************/
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


  /*
   * user_id를 사용하여 user를 찾은 다음, 해당 user를 rotation_attendee 데이터베이스에서 찾는다.
   * 만약 데이터베이스에 존재하지 않는 user라면 저장, 존재하는 user라면 값을 덮어씌운다.
   */
  async createRegistration(createRotationDto: CreateRotationDto, user_id: number) {
    const { attend_limit } = createRotationDto;
    const { year, month } = getNextYearAndMonth();

    if (getFourthWeekdaysOfMonth().indexOf(getTodayDate()) < 0) {
      throw new BadRequestException("Invalid date: Today is not a fourth weekday of the month.");
    }

    try {
      const user = await this.userRepository.findOne({
        where: {
          id: user_id
        }
      });

      if (!user) {
        // this.logger.warn(`User with ID ${user_id} not found`);
        throw new NotFoundException(`User with ID ${user_id} not found`);
      }

      const attendeeAlreadyExist = await this.attendeeRepository.findOne({
        where: {
          userId: user.id,
          year: year,
          month: month
        }
      });

      if (!attendeeAlreadyExist) {
        const newRotation = new RotationAttendee();
        newRotation.userId = user_id;
        newRotation.year = year;
        newRotation.month = month;
        newRotation.attend_limit = attend_limit;

        await this.attendeeRepository.save(newRotation);
        return newRotation;
      }

      attendeeAlreadyExist.attend_limit = attend_limit; // update this month's attendee info
      await this.attendeeRepository.save(attendeeAlreadyExist);
      return attendeeAlreadyExist;
    }
    catch (error) {
      // this.logger.error("Error occoured: " + error);
      throw new Error(`Error occurred: ${error}`);
    }
  }

  async createTestUser(nickname: string): Promise<User>
  {
    const newUser = this.userRepository.create({
      nickname,
    });

    return this.userRepository.save(newUser);
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
