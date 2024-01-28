import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MonthValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined || value === null) {
      return 0;
    } else if (value.match(/^[0-9]+$/) === null) {
      throw new BadRequestException(`Invalid month: ${value}`);
    } else {
      /* valid number format */
    }

    const month = parseInt(value, 10);

    if (month < 1 || month > 12) {
      throw new BadRequestException(`Invalid month: ${value}`);
    } else {
      return value;
    }
  }
}
