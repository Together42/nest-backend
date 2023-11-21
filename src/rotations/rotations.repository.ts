import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Rotation } from './entities/rotation/rotation.entity';
import { getNextYearAndMonth } from './utils/date';
import { HolidayService } from './holiday.service';
import { RotationsService } from './rotations.service';
import { RotationAttendee } from './entities/rotation/rotation-attendee.entity';
import { createRotation } from './utils/rotation';

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
export class CustomRotationRepository extends Repository<Rotation> {
  private readonly logger = new Logger(CustomRotationRepository.name);
  constructor(
    // RotationsService와 customRotationRepository가 상호 참조 관계여서 필요한 설정
    @Inject(forwardRef(() => RotationsService))
    private rotationService: RotationsService,
    private holidayService: HolidayService,
    private dataSource: DataSource,
  ) {
    super(Rotation, dataSource.createEntityManager());
  }

  /*
   * 다음 달 로테이션에 사용될 새로운 날짜 배열.
   * 다음 달 로테이션 날짜(day)와, 해당 날짜에 배정될
   * 유저 두 명의 아이디가 담길 배열(arr)로 구성된 이중 배열이 반환된다.
   */
  async getInitMonthArray(): Promise<DayObject[][]> {
    const { year, month } = getNextYearAndMonth();
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
  async setRotation(): Promise<DayObject[]> {
    const attendeeArray: Partial<RotationAttendee>[] =
      await this.rotationService.getAllRegistration();
    const monthArrayInfo: DayObject[][] = await this.getInitMonthArray();

    if (!attendeeArray || attendeeArray.length === 0) {
      this.logger.warn('No attendees participated in the rotation');
      return monthArrayInfo.flat(Infinity) as DayObject[];
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
    return rotationResultArray;
  }
}
