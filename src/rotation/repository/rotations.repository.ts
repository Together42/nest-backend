import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RotationEntity } from '../entity/rotation.entity';
import { InjectRepository } from '@nestjs/typeorm';

/*
 * 커스텀 레포지토리로 로테이션 작업에 필요한 추가적인 모듈 분리
 * (rotations service 모듈이 너무 길어져서...)
 */
@Injectable()
export class RotationRepository extends Repository<RotationEntity> {
  private readonly logger = new Logger(RotationRepository.name);
  constructor(
    @InjectRepository(RotationEntity) private dataSource: DataSource,
  ) {
    super(RotationEntity, dataSource.manager);
  }
}
