import { Module } from '@nestjs/common';
import { RotationsService } from './rotations.service';
import { RotationsController } from './rotations.controller';

@Module({
  controllers: [RotationsController],
  providers: [RotationsService],
})
export class RotationsModule {}
