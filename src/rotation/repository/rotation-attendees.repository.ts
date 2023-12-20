import { DataSource, Repository } from 'typeorm';
import { RotationAttendeeEntity } from '../entity/rotation-attendee.entity';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

export class RotationAttendeeRepository extends Repository<RotationAttendeeEntity> {
  private readonly logger = new Logger(RotationAttendeeRepository.name);
  constructor(@InjectRepository(RotationAttendeeEntity) private dataSource: DataSource) {
    super(RotationAttendeeEntity, dataSource.manager);
  }
}
