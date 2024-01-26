import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MonthValidationPipe implements PipeTransform {
  transform(value: any) {
    const month = parseInt(value, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      throw new BadRequestException(`Invalid month: ${value}`);
    }
    return value;
  }
}
