import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class YearValidationPipe implements PipeTransform {
  transform(value: any) {
    if (value === undefined || value === null) {
      return 0;
    } else if (value.match(/^[0-9]+$/) === null) {
      throw new BadRequestException(`Invalid year: ${value}`);
    } else {
      /* valid number format */
    }

    const year = parseInt(value, 10);

    if (year < 2020 || year > 2100) {
      throw new BadRequestException(`Invalid year: ${value}`);
    } else {
      return value;
    }
  }
}
