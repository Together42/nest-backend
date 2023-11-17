import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rotation } from './entities/rotation/rotation.entity';
import { RotationAttendee } from './entities/rotation/rotation-attendee.entity';
import { RotationsService } from './rotations.service';
import { RotationsController } from './rotations.controller';
/* for test */ import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rotation, RotationAttendee, User])],
  controllers: [RotationsController],
  providers: [RotationsService],
})
export class RotationsModule {}
