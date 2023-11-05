import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rotation } from './entities/rotation.entity';
import { RotationAttendee } from './entities/rotation_attendee.entity';
import { RotationsService } from './rotations.service';
import { RotationsController } from './rotations.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rotation, RotationAttendee]),
  ],
  controllers: [RotationsController],
  providers: [RotationsService],
})
export class RotationsModule {}
