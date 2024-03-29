import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { RotationHolidayEntity } from './entity/holiday.entity';
import { getHolidayArray } from '../rotation/utils/holiday';
import { HolidayRepository } from './repository/holiday.repository';

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

  /*
   * 매 월 15일 자정에 공휴일 정보를 가져와서 DB에 저장.
   */
  @Cron('0 0 15 * *', {
    name: 'saveHolidayInfo',
    timeZone: 'Asia/Seoul',
  })
  async saveHolidayInfo(): Promise<void> {
    this.logger.log('Fetching holiday info...');

    const holidayArray: HolidayInfo[] = await getHolidayArray();

    if (holidayArray === null) {
      return;
    }

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
  }

  async getHolidayByYearAndMonth(year: number, month: number): Promise<number[]> {
    return await this.myHolidayRepository.findHolidayByYearAndMonth(year, month);
  }
}
