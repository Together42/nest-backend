import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { STATUS_CODES } from 'http';
import { UnknownException } from '../exception/unknown.exception';

@Catch(UnknownException)
export class UnknownExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnknownExceptionFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message || STATUS_CODES[status],
    });
  }
}
