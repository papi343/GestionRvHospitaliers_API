import { Test, TestingModule } from '@nestjs/testing';
import { MedecinsService } from './medecins.service';
import { MedecinRepository } from './repositories/medecin.repository';

describe('MedecinsService', () => {
  let service: MedecinsService;

  beforeEach(async () => {
    const mockMedecinRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedecinsService,
        { provide: MedecinRepository, useValue: mockMedecinRepository },
      ],
    }).compile();

    service = module.get<MedecinsService>(MedecinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
