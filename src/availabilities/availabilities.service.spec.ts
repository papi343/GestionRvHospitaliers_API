import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilitiesService } from './availabilities.service';
import { AvailabilityRepository } from './repositories/availability.repository';
import { MedecinRepository } from '../medecins/repositories/medecin.repository';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

describe('AvailabilitiesService', () => {
  let service: AvailabilitiesService;
  let mockAvailabilityRepository: any;
  let mockMedecinRepository: any;

  beforeEach(async () => {
    mockAvailabilityRepository = {
      create: jest.fn(),
      createMany: jest.fn(),
      findAll: jest.fn(),
      findFiltered: jest.fn(),
      findOne: jest.fn(),
      findByDoctorId: jest.fn(),
      findOverlapping: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    mockMedecinRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilitiesService,
        {
          provide: AvailabilityRepository,
          useValue: mockAvailabilityRepository,
        },
        {
          provide: MedecinRepository,
          useValue: mockMedecinRepository,
        },
      ],
    }).compile();

    service = module.get<AvailabilitiesService>(AvailabilitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBulk', () => {
    it('should throw NotFoundException if doctor does not exist', async () => {
      mockMedecinRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createBulk({
          doctorId: 99,
          startDate: '2026-09-15',
          endDate: '2026-09-15',
          startTime: '08:00',
          endTime: '12:00',
          slotDurationMinutes: 30,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should generate slots and call createMany when valid', async () => {
      mockMedecinRepository.findOne.mockResolvedValue({ id: 1, nom: 'Dr. Smith' });
      mockAvailabilityRepository.findOverlapping.mockResolvedValue(null);
      mockAvailabilityRepository.createMany.mockResolvedValue(8);

      const result = await service.createBulk({
        doctorId: 1,
        startDate: '2026-09-15', // mardi
        endDate: '2026-09-15',
        startTime: '08:00',
        endTime: '12:00',
        slotDurationMinutes: 30,
        daysOfWeek: [2], // mardi
      });

      expect(result.createdCount).toBe(8);
      expect(result.skippedCount).toBe(0);
      expect(mockAvailabilityRepository.createMany).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if startDate > endDate', async () => {
      mockMedecinRepository.findOne.mockResolvedValue({ id: 1 });

      await expect(
        service.createBulk({
          doctorId: 1,
          startDate: '2026-09-20',
          endDate: '2026-09-15',
          startTime: '08:00',
          endTime: '12:00',
          slotDurationMinutes: 30,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findFiltered', () => {
    it('should call repository.findFiltered with provided filters', async () => {
      mockMedecinRepository.findOne.mockResolvedValue({ id: 1 });
      mockAvailabilityRepository.findFiltered.mockResolvedValue([]);

      const result = await service.findFiltered({
        doctorId: 1,
        isBooked: false,
      });

      expect(mockAvailabilityRepository.findFiltered).toHaveBeenCalledWith({
        doctorId: 1,
        isBooked: false,
      });
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException if doctorId is provided but doctor not found', async () => {
      mockMedecinRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findFiltered({
          doctorId: 999,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
