import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { CreateRotationDto } from './dto/create-rotation.dto';
// import { UpdateRotationDto } from './dto/rotation/update-rotation.dto';
import { Rotation } from './entities/rotation/rotation.entity';
import { RotationAttendee } from './entities/rotation/rotation-attendee.entity';
/* for test */ import { User } from './entities/user.entity';
import { CustomRotationRepository } from './rotations.repository';
import {
  getFourthWeekdaysOfMonth,
  getNextYearAndMonth,
  getTodayDate,
} from './utils/date';

@Injectable()
export class RotationsService {
  private readonly logger = new Logger(RotationsService.name);

  constructor(
    @InjectRepository(Rotation)
    private rotationRepository: Repository<Rotation>,
    private customRotationRepository: CustomRotationRepository,
    @InjectRepository(RotationAttendee)
    private attendeeRepository: Repository<RotationAttendee>,

    /****  for test  ****/
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // for testing
  @Cron('* * * * * *', {
    name: 'test',
    timeZone: 'Asia/Seoul',
  })
  async test() {
    const ret = await this.customRotationRepository.setRotation();
    return;
  }
  /*
   * 테스팅용 서비스
   * 나중에 유저 소스 머지 후 지울 것!
   */
  async createTestUser(nickname: string): Promise<User> {
    const newUser = this.userRepository.create({
      nickname,
    });

    return this.userRepository.save(newUser);
  }

  /*
   * /attendee
   * user_id를 사용하여 user를 찾은 다음, 해당 user를 rotation_attendee 데이터베이스에서 찾는다.
   * 만약 데이터베이스에 존재하지 않는 user라면 저장, 존재하는 user라면 값을 덮어씌운다.
   * 만약 넷째 주 요청이 아니라면 400 에러를 반환한다.
   * 올바르게 처리되었다면 요청이 처리된 attendee를 반환한다.
   */
  async createRegistration(
    createRotationDto: CreateRotationDto,
    userId: number,
  ): Promise<RotationAttendee> {
    const { attendLimit } = createRotationDto;
    const { year, month } = getNextYearAndMonth();

    /* 4주차인지 확인 */
    if (getFourthWeekdaysOfMonth().indexOf(getTodayDate()) < 0) {
      throw new BadRequestException(
        'Invalid date: Today is not a fourth weekday of the month.',
      );
    }

    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        this.logger.error(`User with ID ${userId} not found`);
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const attendeeExist = await this.attendeeRepository.findOne({
        where: {
          userId: user.id,
          year: year,
          month: month,
        },
      });

      if (!attendeeExist) {
        const newRotation = new RotationAttendee();
        newRotation.userId = userId;
        newRotation.year = year;
        newRotation.month = month;
        newRotation.attendLimit = attendLimit;

        await this.attendeeRepository.save(newRotation);
        return newRotation;
      }

      attendeeExist.attendLimit = attendLimit; // update this month's attendee info
      await this.attendeeRepository.save(attendeeExist);
      return attendeeExist;
    } catch (error) {
      this.logger.error('Error occoured: ' + error);
      throw new Error(error);
    }
  }

  /*
   * /attendee
   * 본인의 다음 달 로테이션 기록을 반환한다.
   * 본인의 로테이션 기록을 반환.
   * 만약 기록이 없다면 빈 객체를 반환한다.
   * 두 개 이상의 기록이 있다면 어떤 오류가 발생한 상황.
   * 로그로 남기고 하나만 가져온다.
   */
  async findRegistration(userId: number): Promise<Partial<RotationAttendee>> {
    const { year, month } = getNextYearAndMonth();

    try {
      const records = await this.attendeeRepository.find({
        where: {
          userId: userId,
          year: year,
          month: month,
        },
        select: ['userId', 'year', 'month', 'attendLimit'],
      });

      if (records.length > 1) {
        this.logger.warn(`Duplicated records found on ${userId}`);
      }

      if (!records || records.length === 0) {
        return {};
      }
      return records[0];
    } catch (error) {
      this.logger.error('Error occoured: ' + error);
      throw new Error(error);
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} rotation`;
  // }

  // updateRegistration(id: number, updateRotationDto: UpdateRotationDto) {
  //   return `This action updates a #${id} rotation`;
  // }

  /*
   * /attendee
   * 본인의 다음 달 로테이션 기록 삭제.
   * 반환값은 없다.
   */
  async removeRegistration(userId: number): Promise<void> {
    const { year, month } = getNextYearAndMonth();

    try {
      const records = await this.attendeeRepository.find({
        where: {
          userId: userId,
          year: year,
          month: month,
        },
      });

      if (!records || records.length === 0) {
        return;
      }

      await this.attendeeRepository.delete(records.map((record) => record.id));
    } catch (error) {
      this.logger.error('Error occoured: ' + error);
      throw new Error(error);
    }
  }

  /*
   * attendee 관련 모듈이지만, 현재 내부 로테이션 작업에만 사용중
   * 해당 year와 month에 해당하는 모든 attendee를 반환한다.
   */
  async getAllRegistration(): Promise<Partial<RotationAttendee>[]> {
    const { year, month } = getNextYearAndMonth();

    try {
      const records = await this.attendeeRepository.find({
        where: {
          year: year,
          month: month,
        },
        select: ['userId', 'year', 'month', 'attendLimit'],
      });

      if (!records || records.length === 0) {
        return [];
      }

      return records;
    } catch (error) {
      this.logger.error('Error occoured: ' + error);
      throw new Error(error);
    }
  }

  // async createRotation(createRotationDto: CreateRotationDto) {
  //   return 'This action adds a new rotation';
  // }

  async findAllRotation() {
    return `This action returns all rotations`;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} rotation`;
  // }

  // async updateRotation(id: number, updateRotationDto: UpdateRotationDto) {
  //   return `This action updates a #${id} rotation`;
  // }

  async removeRotation(id: number) {
    return `This action removes a #${id} rotation`;
  }
}
