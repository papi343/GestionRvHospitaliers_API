import { Test, TestingModule } from '@nestjs/testing';
import { MedecinsController } from './medecins.controller';
import { MedecinsService } from './medecins.service';

describe('MedecinsController', () => {
  let controller: MedecinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedecinsController],
      providers: [MedecinsService],
    }).compile();

    controller = module.get<MedecinsController>(MedecinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
