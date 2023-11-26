import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';

interface HolidayItem {
  locdate?: string;
  dateName?: string;
}

interface HolidayResponse {
  response?: {
    body?: {
      items?: {
        item?: HolidayItem[];
      };
    };
  };
}

interface HolidayInfo {
  year: number;
  month: number;
  day: number;
  info: string;
}

function mySleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getHolidayArray(): Promise<HolidayInfo[]> {
  const MAX_RETRIES = 3;
  const RETRY_INTERVAL_MS = 2000;
  const logger = new Logger(getHolidayArray.name);
  const configService = new ConfigService();

  const SERVICE_KEY: string = configService.get('openApi.serviceKey');
  const OPENAPI_URL: string =
    'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo';
  const SOL_YEAR: number = new Date().getFullYear() + 1;
  const ROW_NUM: number = 100;

  const requestUrl: string = `${OPENAPI_URL}?solYear=${SOL_YEAR}&ServiceKey=${SERVICE_KEY}&_type=json&numOfRows=${ROW_NUM}`;

  let retries: number = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response: AxiosResponse<HolidayResponse> =
        await axios.get(requestUrl);

      const items: HolidayItem[] | undefined =
        response?.data?.response?.body?.items?.item;

      if (!Array.isArray(items)) {
        const itemType = typeof items;

        throw new HttpException(
          `Invalid data: items is not an array: ${itemType}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const holidayArray: HolidayInfo[] = [];

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
