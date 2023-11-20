import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MeetupsModule } from './meetups/meetups.module';
import { BatchModule } from './batch/batch.module';
import { SlackModule } from 'nestjs-slack';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CqrsModule.forRoot(),
    SlackModule.forRoot({
      type: 'api',
      token: process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT!,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MeetupsModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
