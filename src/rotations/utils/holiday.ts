import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import 'dotenv/config';
import { getNextYearAndMonth } from './date';

interface HolidayInfo {
  year: string;
  month: string;
  day: string;
  info: string;
}

export async function storeHolidayInfo(): Promise<void> {
  const SERVICE_KEY = process.env.SERVICE_KEY;
  const HOLIDAY_URL =
    'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo';
  const SOL_YEAR = getNextYearAndMonth().year;
  const ROW_NUM = 100;

  const requestUrl = `${HOLIDAY_URL}?solYear=${SOL_YEAR}&ServiceKey=${SERVICE_KEY}&nomOfRows=${ROW_NUM}&_type=json`;

  try {
    const response: AxiosResponse = await axios.get(requestUrl);

    const items = response?.data?.response?.body?.items?.item;

    if (Array.isArray(items)) {
      for (const item of items) {
        const locDate = item?.locdate?.toString();
      }
    }
    
  }
}
