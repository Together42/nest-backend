import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { VerifyCallback } from 'jsonwebtoken';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: (req) => {
        return req?.cookies?.Refresh;
      },
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  // async validate(req: Request, payload: any) {
  //   console.log('JwtRefreshStrategy');
  //   const refreshToken = req?.cookies?.Refresh;
  //   try {
  //     const user = await this.userService.isRefreshTokenVaild(
  //       refreshToken,
  //       payload.id,
  //     );
  //     if (!user) {
  //       throw new UnauthorizedException('Unauthorized', '401');
  //     }
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // async validate(payload: any, done: VerifyCallback) {
  //   console.log('JwtRefreshStrategy');
  //   try {
  //     done(null, payload);
  //   } catch (error) {
  //     throw new UnauthorizedException('Unauthorized', '401');
  //   }
  }
}
