import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { RotationHolidayEntity } from './entities/holiday/holiday.entity';
import { getHolidayArray } from './utils/holiday';
import { HolidayRepository } from './holiday.repository';

/* 인터페이스 파일을 따로 만들어야 하나? */
interface HolidayInfo {
  year: number;
  month: number;
  day: number;
  info: string;
}

@Injectable()
export class HolidayService {
  private readonly logger = new Logger(HolidayService.name);

  constructor(
    @InjectRepository(RotationHolidayEntity)
    private holidayRepository: Repository<RotationHolidayEntity>,
    private myHolidayRepository: HolidayRepository,
  ) {}

  /* 12월 25일 4시 42분에 실행
   * 왜 갑자기 month가 0부터 11까지로 된거지?
   */
  @Cron('42 4 25 11 *', {
    name: 'saveHolidayInfo',
    timeZone: 'Asia/Seoul',
  })
  async saveHolidayInfo(): Promise<void> {
    try {
      this.logger.log('Fetching holiday info...');

      const holidayArray: HolidayInfo[] = await getHolidayArray();

      for (const holidayInfo of holidayArray) {
        const { year, month, day, info } = holidayInfo;

        const recordExist = await this.holidayRepository.findOne({
          where: {
            year,
            month,
            day,
          },
        });

        if (recordExist) {
          continue;
        }

        const newHoliday = new RotationHolidayEntity();
        newHoliday.year = year;
        newHoliday.month = month;
        newHoliday.day = day;
        newHoliday.info = info;

        await this.holidayRepository.save(newHoliday);
      }
      this.logger.log('Successfully stored holiday info!');
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }

  async getHolidayByYearAndMonth(
    year: number,
    month: number,
  ): Promise<number[]> {
    try {
      return await this.myHolidayRepository.findHolidayByYearAndMonth(
        year,
        month,
      );
    } catch (error: any) {
      this.logger.error(error);
      throw error;
    }
  }
}
