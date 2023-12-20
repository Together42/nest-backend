import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleAuthGuard.name);

  constructor() {
    super({});
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let result: boolean = false;
    if (context.getType() === 'http') {
      this.logger.debug(
        `canActivate [http, ${context.getArgs()[0].method} ${
          context.getArgs()[0].url
        }]`,
      );
    }
    result = (await super.canActivate(context)) as boolean;
    return result;
  }
}
