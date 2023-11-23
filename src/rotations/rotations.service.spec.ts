import { Test, TestingModule } from '@nestjs/testing';
import { RotationsService } from './rotations.service';

describe('RotationsService', () => {
  let service: RotationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RotationsService],
    }).compile();

    service = module.get<RotationsService>(RotationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
