import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { VerifyCallback } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt.secret'),
      expiresIn: configService.get<string>('jwt.expiresIn'),
    });
  }
  async validate(payload: any, done: VerifyCallback) {
    this.logger.debug(`validate [payload: ${JSON.stringify(payload)}]`);
    try {
      done(null, payload);
    } catch (error) {
      throw new UnauthorizedException('Unauthorized', '401');
    }
  }
}
