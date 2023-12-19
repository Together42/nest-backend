import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { RotationEntity } from './entity/rotation.entity';
import { RotationAttendeeEntity } from './entity/rotation-attendee.entity';
import { UserService } from 'src/user/user.service';
import { CustomRotationRepository } from './repository/rotations.repository';
import { getFourthWeekdaysOfMonth, getNextYearAndMonth, getTodayDate } from './utils/date';

@Injectable()
export class RotationsService {
  private readonly logger = new Logger(RotationsService.name);

  constructor(
    @InjectRepository(RotationEntity)
    private rotationRepository: Repository<RotationEntity>,
    private customRotationRepository: CustomRotationRepository,
    @InjectRepository(RotationAttendeeEntity)
    private attendeeRepository: Repository<RotationAttendeeEntity>,
    private userService: UserService,
  ) {}

  /*
   * 4주차 월요일에 유저를 모두 DB에 담아놓는 작업 필요
   * [update 20231219] - 매 달 1일에 유저를 모두 DB에 담아놓는 작업으로 변경
   */
  @Cron(`0 0 1 * *`, {
    name: 'initRotation',
    timeZone: 'Asia/Seoul',
  })
  async initRotation(): Promise<void> {
    try {
      await this.customRotationRepository.initRotation();
      this.logger.log('Init rotation finished');
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }
  // @Cron(`0 0 * * 1`, {
  //   name: 'initRotation',
  //   timeZone: 'Asia/Seoul',
  // })
  // async initRotation(): Promise<void> {
  //   if (getFourthWeekdaysOfMonth().includes(getTodayDate())) {
  //     try {
  //       await this.customRotationRepository.initRotation();
  //       this.logger.log('Init rotation finished');
  //     } catch (error: any) {
  //       this.logger.error(error);
  //       throw error;
  //     }
  //   }
  // }

  /*
   * 매주 금요일을 체크하여, 만약 4주차 금요일인 경우,
   * 23시 59분에 로테이션을 돌린다.
   */
  @Cron(`59 23 * * 5`, {
    name: 'setRotation',
    timeZone: 'Asia/Seoul',
  })
  async setRotation(): Promise<void> {
    if (getFourthWeekdaysOfMonth().indexOf(getTodayDate()) > 0) {
      try {
        this.logger.log('Setting rotation...');
        await this.customRotationRepository.setRotation();
        this.logger.log('Successfully set rotation!');
      } catch (error: any) {
        this.logger.error(error);
        throw error;
      }
    } else {
      // skipped...
    }
  }

  /*
   * /rotations/today (GET)
   * 구글 API에서 당일 사서를 가져오는데 사용되는 서비스
   * 당일 사서이기 때문에, 만약 데이터가 두 개 이상 나온다면 오류 로그를 찍는다.
   */
  async findTodayRotation(): Promise<Partial<RotationEntity>[]> {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    try {
      const records: Partial<RotationEntity>[] = await this.rotationRepository.find({
        where: {
          year: year,
          month: month,
          day: day,
        },
        select: ['userId', 'year', 'month', 'day'],
      });

      return records;
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }

  /*
   * /rotations/attendance (GET)
   * 본인의 다음 달 로테이션 기록을 반환한다.
   * 본인의 로테이션 기록을 반환.
   * 만약 기록이 없다면 빈 객체를 반환한다.
   * 두 개 이상의 기록이 있다면 어떤 오류가 발생한 상황.
   * 로그로 남기고 하나만 가져온다.
   * [20231219 수정] - 만약 records가 빈 객체인 경우,
   * attendLimit이 빈 배열인 객체를 반환한다.
   */
  async findRegistration(userId: number): Promise<Partial<RotationAttendeeEntity>> {
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

      const intraIdRecord = await this.userService.findOneById(userId);
      const modifiedRecord = {};

      if (records.length == 0) {
        modifiedRecord['year'] = year;
        modifiedRecord['month'] = month;
        modifiedRecord['attendLimit'] = [];
        modifiedRecord['intraId'] = intraIdRecord.nickname;
      } else {
        modifiedRecord['year'] = records[0].year;
        modifiedRecord['month'] = records[0].month;
        modifiedRecord['attendLimit'] = records[0].attendLimit;
        modifiedRecord['intraId'] = intraIdRecord.nickname;
      }

      return modifiedRecord;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  /*
   * /rotations/attendance (POST)
   * user_id를 사용하여 user를 찾은 다음, 해당 user를 rotation_attendee 데이터베이스에서 찾는다.
   * 만약 데이터베이스에 존재하지 않는 user라면 저장, 존재하는 user라면 값을 덮어씌운다.
   * 만약 넷째 주 요청이 아니라면 400 에러를 반환한다.
   * 올바르게 처리되었다면 요청이 처리된 attendee를 반환한다.
   * [20231218 수정] - 4주차인지 확인하는 로직 삭제
   */
  async createRegistration(
    createRegistrationDto: CreateRegistrationDto,
    userId: number,
  ): Promise<RotationAttendeeEntity> {
    const { attendLimit } = createRegistrationDto;
    const { year, month } = getNextYearAndMonth();

    /* 4주차인지 확인 */
    // if (getFourthWeekdaysOfMonth().indexOf(getTodayDate()) < 0) {
    //   throw new BadRequestException(
    //     'Invalid date: Today is not a fourth weekday of the month.',
    //   );
    // }

    try {
      const user = await this.userService.findOneById(userId);

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
        const newRotation = new RotationAttendeeEntity();
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
      this.logger.error(error);
      throw error;
    }
  }

  /*
   * /rotations/attendance (DELETE)
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
      this.logger.error(error);
      throw error;
    }
  }

  /*
   * attendee 관련 모듈이지만, 현재 내부 로테이션 작업에만 사용중
   * 해당 year와 month에 해당하는 모든 attendee를 반환한다.
   */
  async getAllRegistration(): Promise<Partial<RotationAttendeeEntity>[]> {
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
      this.logger.error(error);
      throw error;
    }
  }

  /*
   * /rotations (GET)
   * 로테이션의 모든 기록을 반환하는 서비스.
   * 기본적으로는 모든 로테이션을 반환.
   * 만약 parameter로 month와 year가 들어오면, 해당 스코프에 맞는 레코드를 반환.
   */
  async findAllRotation(year?: number, month?: number): Promise<Partial<RotationEntity>[]> {
    try {
      let records: Promise<Partial<RotationEntity>[]>;

      if (year && month) {
        records = this.rotationRepository.find({
          where: {
            year: year,
            month: month,
          },
        });
      } else {
        records = this.rotationRepository.find();
      }

      const modifiedRecords = await Promise.all(
        (await records).map(async (record) => {
          const userRecord = await this.userService.findOneById(record.userId);
          return { ...record, intraId: userRecord.nickname };
        }),
      );

      return modifiedRecords;
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }

  /*
   * /rotations (POST)
   * 유저 본인이 달력에 자신의 일정을 추가하는 서비스.
   * 만약 같은 날을 입력했다면, TypeORM의 save 메서드가 알아서 업데이트 해주는 것 같다.
   */
  async createOrUpdateRotation(
    createRotationDto: CreateRotationDto,
    userId: number,
  ): Promise<string> {
    const { attendDate, year, month } = createRotationDto;

    try {
      const parsedData: number[] = JSON.parse(JSON.stringify(attendDate));

      for (const day of parsedData) {
        const recordExist = await this.rotationRepository.findOne({
          where: {
            userId: userId,
            year: year,
            month: month,
            day: day,
          },
        });

        if (recordExist) {
          await this.rotationRepository
            .createQueryBuilder()
            .update(RotationEntity)
            .set({ updateUserId: userId })
            .where('userId = :userId AND year = :year AND month = :month AND day = :day', {
              userId,
              year,
              month,
              day,
            })
            .execute();
        } else {
          const newRotation = this.rotationRepository.create({
            userId,
            updateUserId: userId,
            year,
            month,
            day,
          });
          await this.rotationRepository.save(newRotation);
        }
        return `successfully create user ${userId}'s information`;
      }
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }

  /*
   * /rotations (DELETE)
   * 로테이션을 삭제하는 서비스
   * month, year가 주어진다면 해당 스코프에 맞는 유저의 day를 삭제
   * 아무것도 없다면 다음 달에 해당하는 유저의 day를 삭제
   */
  async removeRotation(
    userId: number,
    day: number,
    month?: number,
    year?: number,
  ): Promise<string> {
    try {
      if (!day) {
        throw new BadRequestException('Invalid date: day is not provided');
      }

      let deleteQuery = this.rotationRepository.createQueryBuilder('rotation').delete();

      if (month && year) {
        deleteQuery = deleteQuery.where(
          'rotation.user_id = :userId AND rotation.year = :year AND rotation.month = :month AND rotation.day = :day',
          {
            userId,
            year,
            month,
            day,
          },
        );
      } else {
        const { year, month } = getNextYearAndMonth();
        deleteQuery = deleteQuery.where(
          'rotation.user_id = :userId AND rotation.year = :year AND rotation.month = :month AND rotation.day = :day',
          {
            userId,
            year,
            month,
            day,
          },
        );
      }

      const deleteResult = await deleteQuery.execute();

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`userId ${userId} rotation not found`);
      }

      return `${userId} rotation at ${month}/${year} has been successfully deleted`;
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }

  /*
   * /rotations/:id (PATCH)
   * 로테이션을 업데이트하는 서비스.
   * id는 유저의 intra id를 의미한다.
   * 해당 유저의 정보를 찾은 다음, 해당 유저의 정보를 업데이트한다.
   */
  async updateRotation(
    updateRotationDto: UpdateRotationDto,
    updateUserintraId: string,
    userId: number,
  ): Promise<string> {
    const { attendDate, updateDate, year, month } = updateRotationDto;
    const day: number = JSON.parse(JSON.stringify(attendDate))[0];

    try {
      const findUser = await this.userService.findOneByIntraId(updateUserintraId);

      if (!findUser) {
        throw new NotFoundException(`User ${updateUserintraId} information not found`);
      }

      const updateUserId = findUser.id;

      const recordExist = await this.rotationRepository.findOne({
        where: {
          userId: updateUserId,
          year: year,
          month: month,
          day: day,
        },
      });

      if (recordExist) {
        await this.rotationRepository
          .createQueryBuilder()
          .update(RotationEntity)
          .set({ updateUserId: userId, day: updateDate })
          .where('userId = :updateUserId AND year = :year AND month = :month AND day = :day', {
            updateUserId,
            year,
            month,
            day,
          })
          .execute();
      } else {
        throw new NotFoundException(`User ${updateUserId} information not found`);
      }

      return `successfully update user ${updateUserId}'s information`;
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }

  /*
   * auth.service.ts에서 사용하는 서비스
   * 새로운 유저가 생성되면, 해당 유저를 다음 달 로테이션 참석자에 추가한다.
   */
  async createNewRegistration(userId: number): Promise<RotationAttendeeEntity> {
    const { year, month } = getNextYearAndMonth();

    try {
      const newRotation = new RotationAttendeeEntity();
      newRotation.userId = userId;
      newRotation.year = year;
      newRotation.month = month;
      newRotation.attendLimit = JSON.parse(JSON.stringify([]));

      await this.attendeeRepository.save(newRotation);
      return newRotation;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
