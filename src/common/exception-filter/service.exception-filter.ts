import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ServiceException } from '../exception/service.exception';

@Catch(ServiceException)
export class ServiceExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ServiceExceptionFilter.name);

  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      errorCode: exception.getErrorCode(),
      message: exception.getMessage(),
    });
  }
}
