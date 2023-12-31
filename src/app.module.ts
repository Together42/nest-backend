import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RotationsModule } from './rotation/rotations.module';
import { MeetupsModule } from './meetups/meetups.module';
import { BatchModule } from './batch/batch.module';
import { SlackModule } from 'nestjs-slack';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.prod'
          : process.env.NODE_ENV === 'development'
            ? '.env.dev'
            : '.env',
      isGlobal: true,
      load: [configuration],
    }),
    CqrsModule.forRoot(),
    SlackModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        type: 'api',
        token: configService.get('slack.botToken'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.DB_HOST'),
        port: configService.get('database.DB_PORT'),
        username: configService.get('database.DB_USER'),
        password: configService.get('database.DB_PASSWORD'),
        database: configService.get('database.DB_DATABASE'),
        entities: ['dist/**/*.entity.js'],
        synchronize: configService.get('database.DB_SYNC'),
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    RotationsModule,
    AuthModule,
    UserModule,
    MeetupsModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
