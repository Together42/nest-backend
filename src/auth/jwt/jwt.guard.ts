import { 
  Injectable,
  ExecutionContext,
  Logger
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean>{
    if (context.getType() === 'http') {
      this.logger.debug(`canActivate [http, ${context.getArgs()[0].method} ${context.getArgs()[0].url}]`);
    } else{
      this.logger.debug(`canActivate [not http]`);
      return false;
    }
    const token = context.switchToHttp().getRequest().headers?.authorization?.split('Bearer ')[1];
    this.logger.debug(`canActivate [token: ${token}]`);

    const result: boolean = (await super.canActivate(context)) as boolean;
    this.logger.log(`canActivate [result: ${result}]`);
    return result;
  }
}