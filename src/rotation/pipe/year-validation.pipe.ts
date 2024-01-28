import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class YearValidationPipe implements PipeTransform {
  transform(value: any) {
    const year = parseInt(value, 10);
    if (isNaN(year) || year === null) {
      return 0;
    } else if (year < 2020 || year > 2100) {
      throw new BadRequestException(`Invalid year: ${value}`);
    } else {
      return value;
    }
  }
}
