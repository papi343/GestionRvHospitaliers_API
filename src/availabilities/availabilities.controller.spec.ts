import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilitiesController } from './availabilities.controller';
import { AvailabilitiesService } from './availabilities.service';

describe('AvailabilitiesController', () => {
  let controller: AvailabilitiesController;

  beforeEach(async () => {
    const mockAvailabilitiesService = {
      create: jest.fn(),
      createBulk: jest.fn(),
      findAll: jest.fn(),
      findFiltered: jest.fn(),
      findOne: jest.fn(),
      findByDoctorId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilitiesController],
      providers: [
        { provide: AvailabilitiesService, useValue: mockAvailabilitiesService },
      ],
    }).compile();

    controller = module.get<AvailabilitiesController>(AvailabilitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
