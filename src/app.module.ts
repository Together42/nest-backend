import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RotationsModule } from './rotations/rotations.module';

@Module({
  imports: [RotationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
