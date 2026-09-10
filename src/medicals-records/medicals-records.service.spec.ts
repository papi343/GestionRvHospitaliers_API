import { Test, TestingModule } from '@nestjs/testing';
import { MedicalsRecordsService } from './medicals-records.service';
import { MedicalsRecordRepository } from './repositories/medicals-record.repository';
import { AppointmentRepository } from '../appointment/repositories/appointment.repository';

describe('MedicalsRecordsService', () => {
  let service: MedicalsRecordsService;

  const mockMedicalsRecordRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByAppointmentId: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAppointmentRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicalsRecordsService,
        { provide: MedicalsRecordRepository, useValue: mockMedicalsRecordRepository },
        { provide: AppointmentRepository, useValue: mockAppointmentRepository },
      ],
    }).compile();

    service = module.get<MedicalsRecordsService>(MedicalsRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
