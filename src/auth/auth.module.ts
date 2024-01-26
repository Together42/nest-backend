import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleMiddleware } from '../middleware/google.middleware';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { RotationsService } from 'src/rotation/rotations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RotationEntity } from 'src/rotation/entity/rotation.entity';
import { RotationAttendeeEntity } from 'src/rotation/entity/rotation-attendee.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { RotationRepository } from 'src/rotation/repository/rotations.repository';
import { RotationAttendeeRepository } from 'src/rotation/repository/rotation-attendees.repository';
import { HolidayModule } from 'src/holiday/holiday.module';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/repository/user.repository';
import { SlackModule } from 'src/slack/slack.module';

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
    HolidayModule,
    SlackModule,
    TypeOrmModule.forFeature([RotationEntity, RotationAttendeeEntity, UserEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    RotationsService,
    RotationRepository,
    RotationAttendeeRepository,
    GoogleStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(GoogleMiddleware).forRoutes('/auth/signup');
  }
}
