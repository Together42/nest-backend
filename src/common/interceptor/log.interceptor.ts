import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { ServiceException } from '../exception/service.exception';
import { UnknownException } from '../exception/unknown.exception';
import { SlackService } from 'nestjs-slack';
import { Message } from 'slack-block-builder';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogInterceptor.name);

  constructor(
    private slackService: SlackService,
    private configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    // const start = new Date();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      catchError((err) => {
        const log = `${request.method} ${request.url} - ${err.stack}`;
        this.logger.error(log);
        if (err instanceof ServiceException || err instanceof HttpException) {
          throw err;
        }
        this.slackService.postMessage(
          Message({
            text: log,
            channel: this.configService.get('slack.jiphyeonjeonChannel'),
          }).buildToObject(),
        );
        throw new UnknownException();
      }),
      //   tap((observable) => {
      //     const end = new Date();
      //   }),
    );
  }
}
