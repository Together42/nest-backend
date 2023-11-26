import { Test, TestingModule } from '@nestjs/testing';
import { RotationsController } from './rotations.controller';
import { RotationsService } from './rotations.service';

describe('RotationsController', () => {
  let controller: RotationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RotationsController],
      providers: [RotationsService],
    }).compile();

    controller = module.get<RotationsController>(RotationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
