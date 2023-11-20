import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Rotation } from './entities/rotation/rotation.entity';
import { getNextYearAndMonth } from './utils/date';
import { HolidayService } from './holiday.service';

interface DayObject {
  day: number;
  arr: number[];
}

@Injectable()
export class RotationRepository extends Repository<Rotation> {
  constructor(
    private holidayService: HolidayService,
    private dataSource: DataSource,
  ) {
    super(Rotation, dataSource.createEntityManager());
  }

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
}
