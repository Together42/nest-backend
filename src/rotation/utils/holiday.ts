import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { getNextYearAndMonth } from './date';

interface HolidayResponse {
  response?: {
    body?: {
      items?: {
        item?: HolidayItem[];
      };
      totalCount?: number;
    };
  };
}

interface HolidayInfo {
  year: number;
  month: number;
  day: number;
  info: string;
}

interface HolidayItem {
  locdate?: string;
  dateName?: string;
}

function mySleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getHolidayArray(): Promise<HolidayInfo[]> {
  const MAX_RETRIES = 5;
  const RETRY_INTERVAL_MS = 4242;
  const logger = new Logger(getHolidayArray.name);

  const SERVICE_KEY: string = process.env.SERVICE_KEY || '';
  const OPENAPI_URL: string =
    'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo';
  const { year, month } = getNextYearAndMonth();
  const SOL_YEAR: number = year;
  const SOL_MONTH: string = month.toString().padStart(2, '0');
  const ROW_NUM: number = 100;

  const requestUrl: string = `${OPENAPI_URL}?solYear=${SOL_YEAR}&solMonth=${SOL_MONTH}&ServiceKey=${SERVICE_KEY}&_type=json&numOfRows=${ROW_NUM}`;

  let retries: number = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response: AxiosResponse<HolidayResponse> = await axios.get(requestUrl);

      if (response.data === undefined) {
        throw new HttpException(`Invalid data: response is undefined`, HttpStatus.NOT_FOUND);
      }

      const data: HolidayResponse | undefined = response.data;

      if (data === undefined) {
        throw new HttpException(`Invalid data: items is undefined`, HttpStatus.NOT_FOUND);
      }

      if (data.response.body.totalCount === 0) {
        return null;
      }

      const holidayArray: HolidayInfo[] = [];

      if (data.response.body.totalCount === 1) {
        const item: any = data.response.body.items.item; // Type is hard

        if (item === undefined) {
          throw new HttpException(`Invalid data: data must not be an array`, HttpStatus.NOT_FOUND);
        }

        if (!item?.locdate) {
          throw new HttpException(
            'Invalid data: data must contain a date element',
            HttpStatus.BAD_REQUEST,
          );
        }

        const locdateString: string = item.locdate.toString();
        const regEx = /^\d{4}\d{2}\d{2}$/;

        if (!locdateString.match(regEx)) {
          throw new HttpException(
            `Invalid data: wrong date format: ${locdateString}`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const holidayInfo: HolidayInfo = {
          year: +locdateString.slice(0, 4),
          month: +locdateString.slice(4, 6),
          day: +locdateString.slice(6, 8),
          info: item.dateName || 'null',
        };

        holidayArray.push(holidayInfo);
        return holidayArray;
      }

      if (data.response.body.totalCount > 2) {
        const items: HolidayItem[] = data.response.body.items.item;

        for (const item of items) {
          if (!item?.locdate) {
            throw new HttpException(
              'Invalid data: data must contain a date element',
              HttpStatus.BAD_REQUEST,
            );
          }

          const locdateString: string = item.locdate.toString();
          const regEx = /^\d{4}\d{2}\d{2}$/;

          if (!locdateString.match(regEx)) {
            throw new HttpException(
              `Invalid data: wrong date format: ${locdateString}`,
              HttpStatus.BAD_REQUEST,
            );
          }

          const holidayInfo: HolidayInfo = {
            year: +locdateString.slice(0, 4),
            month: +locdateString.slice(4, 6),
            day: +locdateString.slice(6, 8),
            info: item.dateName || 'null',
          };
          holidayArray.push(holidayInfo);
        }

        return holidayArray;
      } else {
        throw new HttpException(
          `Invalid data: data must be an array or an object`,
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error: any) {
      retries++;
      logger.error(`Error occurred: ${error}. Retrying... (${retries})`);
      await mySleep(RETRY_INTERVAL_MS);
    }
  }

  throw new HttpException(
    'Failed to fetch holiday info after multiple retries',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
