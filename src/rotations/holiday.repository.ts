import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RotationHoliday } from './entities/holiday/holiday.entity';

/* 레포지토리 연습용으로 한 번 만들어보기
 * https://stackoverflow.com/questions/72549668/how-to-do-custom-repository-using-typeorm-mongodb-in-nestjs
 */
@Injectable()
export class HolidayRepository extends Repository<RotationHoliday> {
  constructor(private dataSource: DataSource) {
    super(RotationHoliday, dataSource.createEntityManager());
  }

  async findHolidayByYearAndMonth(
    year: number,
    month: number,
  ): Promise<number[]> {
    try {
      const records = await this.find({
        where: {
          year: year,
          month: month,
        },
      });

      if (records.length === 0) {
        return [];
      }

      return records.map((record) => record.day);
    } catch (error: any) {
      throw new Error(`Error occurred in findHolidayByYearAndMonth: ${error}`);
    }
  }
}
