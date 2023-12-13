import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('JwtRefreshGuard');
    const token = this.getToken(context);
    const result = await this.validateToken(token);
    return result;
  }

  private getToken(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    const rawCookies = request.headers.cookie?.split(';');
    const parsedCookies: any = {};
    rawCookies?.forEach((rawCookie) => {
      const parsedCookie = rawCookie.split('=');
      parsedCookies[parsedCookie[0].trim()] = parsedCookie[1];
    });
    const token = parsedCookies.refresh_token;
    return token;
  }

  private async validateToken(token: string): Promise<boolean> {
    try {
      const result = verify(token, process.env.JWT_REFRESH_SECRET, {
        ignoreExpiration: false,
      });
      console.log('validateToken', result);
      return true;
    } catch (error) {
      return false;
    }
  }
}
