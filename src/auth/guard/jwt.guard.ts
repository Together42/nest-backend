import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UnknownException } from 'src/common/exception/unknown.exception';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtGuard.name);
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() === 'http') {
      this.logger.debug(
        `canActivate [http, ${context.getArgs()[0].method} ${context.getArgs()[0].url}]`,
      );
    } else {
      this.logger.debug(`canActivate [not http]`);
      return false;
    }
    const token = context.switchToHttp().getRequest().headers?.authorization?.split('Bearer ')[1];
    this.logger.debug(`canActivate [token: ${token}]`);

    // if (!token) {
    //   this.logger.debug(`canActivate [no token]`);
    //   return false;
    // }
    let result: boolean = false;
    try {
      result = (await super.canActivate(context)) as boolean;
      this.logger.debug(`canActivate [result: ${result}]`);
    } catch (error) {
      this.logger.error(`canActivate [error: ${error}]`);
      /*
      token could be expired or invaild
      return exception to client and let client to refresh token
      */
      throw new UnknownException(error);
    }
    this.logger.debug(`canActivate [result: ${result}]`);
    return result;
  }

  // handleRequest<TUser = any>(
  //   err: Error,
  //   user: any,
  //   info: any,
  //   context: ExecutionContext,
  //   status?: any,
  // ): TUser {
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}
