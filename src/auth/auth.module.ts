import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google/google.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { GoogleMiddleware } from './google/google.middleware';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
          algorithm: 'HS256',
        },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [UserService, AuthService, GoogleStrategy, JwtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(GoogleMiddleware).forRoutes('/auth/signup');
  }
}
