import { Test, TestingModule } from '@nestjs/testing';
import { MedecinsController } from './medecins.controller';
import { MedecinsService } from './medecins.service';

describe('MedecinsController', () => {
  let controller: MedecinsController;

  beforeEach(async () => {
    const mockMedecinsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedecinsController],
      providers: [
        { provide: MedecinsService, useValue: mockMedecinsService },
      ],
    }).compile();

    controller = module.get<MedecinsController>(MedecinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
