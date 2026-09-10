import { Test, TestingModule } from '@nestjs/testing';
import { MedicalsRecordsController } from './medicals-records.controller';
import { MedicalsRecordsService } from './medicals-records.service';

describe('MedicalsRecordsController', () => {
  let controller: MedicalsRecordsController;

  const mockMedicalsRecordsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByAppointmentId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicalsRecordsController],
      providers: [
        { provide: MedicalsRecordsService, useValue: mockMedicalsRecordsService },
      ],
    }).compile();

    controller = module.get<MedicalsRecordsController>(MedicalsRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
