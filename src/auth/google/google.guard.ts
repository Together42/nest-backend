import { 
  Injectable,
  ExecutionContext,
  Logger
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleAuthGuard.name);

  constructor(){
    super({
    })
  }
  async canActivate(context: ExecutionContext): Promise<boolean>{
    if (context.getType() === 'http') {
      this.logger.debug(`canActivate [http, ${context.getArgs()[0].method} ${context.getArgs()[0].url}]`);
    }
    const token = context.switchToHttp().getRequest().headers?.authorization?.split('Bearer ')[1];
    const result: boolean = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    // await super.logIn(request);
    this.logger.debug(`canActivate success [request.user: ${JSON.stringify(request.user)}]`)
    return result;
  }
}