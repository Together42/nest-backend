import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RotationEntity } from './entities/rotation/rotation.entity';
import { getNextYearAndMonth } from './utils/date';
import { HolidayService } from './holiday.service';
import { RotationsService } from './rotations.service';
import { RotationAttendeeEntity } from './entities/rotation/rotation-attendee.entity';
import { createRotation } from './utils/rotation';
import { UserService } from 'src/user/user.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

interface DayObject {
  day: number;
  arr: number[];
}

interface RotationAttendeeInfo {
  userId: number;
  year: number;
  month: number;
  attendLimit: number[];
  attended: number;
}

/*
 * 커스텀 레포지토리로 로테이션 작업에 필요한 추가적인 모듈 분리
 * (rotations service 모듈이 너무 길어져서...)
 */
@Injectable()
export class CustomRotationRepository extends Repository<RotationEntity> {
  private readonly logger = new Logger(CustomRotationRepository.name);
  constructor(
    // RotationsService와 customRotationRepository가 상호 참조 관계여서 필요한 설정
    @Inject(forwardRef(() => RotationsService))
    private rotationService: RotationsService,
    private holidayService: HolidayService,
    private userService: UserService,
    private dataSource: DataSource,
  ) {
    super(RotationEntity, dataSource.createEntityManager());
  }

  /*
   * 다음 달 로테이션에 사용될 새로운 날짜 배열.
   * 다음 달 로테이션 날짜(day)와, 해당 날짜에 배정될
   * 유저 두 명의 아이디가 담길 배열(arr)로 구성된 이중 배열이 반환된다.
   */
  async getInitMonthArray(year: number, month: number): Promise<DayObject[][]> {
    const daysOfMonth = new Date(year, month, 0).getDate();
    const holidayArrayOfMonth: number[] =
      await this.holidayService.getHolidayByYearAndMonth(year, month);

    const MonthArray: DayObject[][] = [];
    let tmpWeekArray: DayObject[] = [];

    for (let i = 1; i <= daysOfMonth; i++) {
      if (
        new Date(year, month - 1, i).getDay() > 0 &&
        new Date(year, month - 1, i).getDay() < 6
      ) {
        const day = new Date(year, month - 1, i).getDate();

        if (!holidayArrayOfMonth.includes(day)) {
          const tmpDayObject: DayObject = { day, arr: [0, 0] };

          tmpWeekArray.push(tmpDayObject);

          if (i === daysOfMonth) {
            MonthArray.push(tmpWeekArray);
          }
        } else {
          continue;
        }
      } else {
        if (tmpWeekArray.length > 0) {
          MonthArray.push(tmpWeekArray);
          tmpWeekArray = [];
        } else {
          // already pushed tmpWeekArray
        }
      }
    }
    return MonthArray;
  }

  /*
   * 다음 달 로테이션 참석자를 바탕으로 로테이션 결과 반환
   */
  async setRotation(): Promise<void> {
    try {
      const { year, month } = getNextYearAndMonth();
      const attendeeArray: Partial<RotationAttendeeEntity>[] =
        await this.rotationService.getAllRegistration();
      const monthArrayInfo: DayObject[][] = await this.getInitMonthArray(
        year,
        month,
      );

      if (!attendeeArray || attendeeArray.length === 0) {
        this.logger.warn('No attendees participated in the rotation');
        return;
      }

      const rotationAttendeeInfo: RotationAttendeeInfo[] = attendeeArray.map(
        (attendee) => {
          const parsedAttendLimit: number[] = JSON.parse(
            JSON.stringify(attendee.attendLimit),
          );
          return {
            userId: attendee.userId,
            year: attendee.year,
            month: attendee.month,
            attendLimit: parsedAttendLimit,
            attended: 0,
          };
        },
      );

      const rotationResultArray: DayObject[] = createRotation(
        rotationAttendeeInfo,
        monthArrayInfo,
      );

      for (const item of rotationResultArray) {
        const [userId1, userId2] = item.arr;

        let attendeeExist = await this.findOne({
          where: {
            userId: userId1,
            year: year,
            month: month,
            day: item.day,
          },
        });

        if (!attendeeExist) {
          const rotation1 = new RotationEntity();
          rotation1.userId = userId1;
          rotation1.updateUserId = userId1;
          rotation1.year = year;
          rotation1.month = month;
          rotation1.day = item.day;

          await this.save(rotation1);
        }

        attendeeExist = await this.findOne({
          where: {
            userId: userId2,
            year: year,
            month: month,
            day: item.day,
          },
        });

        if (!attendeeExist) {
          const rotation2 = new RotationEntity();
          rotation2.userId = userId2;
          rotation2.updateUserId = userId2;
          rotation2.year = year;
          rotation2.month = month;
          rotation2.day = item.day;

          await this.save(rotation2);
        }
      }
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }

  async initRotation(): Promise<void> {
    try {
      // get all users
      // make new rotation
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }
}
