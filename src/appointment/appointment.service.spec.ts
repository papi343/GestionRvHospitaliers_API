import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { AppointmentRepository } from './repositories/appointment.repository';
import { PatientRepository } from '../patients/repositories/patient.repository';
import { MedecinRepository } from '../medecins/repositories/medecin.repository';
import { AvailabilityRepository } from '../availabilities/repositories/availability.repository';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let mockAppointmentRepository: any;
  let mockPatientRepository: any;
  let mockMedecinRepository: any;
  let mockAvailabilityRepository: any;

  beforeEach(async () => {
    mockAppointmentRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findFiltered: jest.fn(),
      findOne: jest.fn(),
      findByAvailabilityId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    mockPatientRepository = {
      getOnePatient: jest.fn(),
    };

    mockMedecinRepository = {
      findOne: jest.fn(),
    };

    mockAvailabilityRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: AppointmentRepository, useValue: mockAppointmentRepository },
        { provide: PatientRepository, useValue: mockPatientRepository },
        { provide: MedecinRepository, useValue: mockMedecinRepository },
        { provide: AvailabilityRepository, useValue: mockAvailabilityRepository },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if patient does not exist', async () => {
      mockPatientRepository.getOnePatient.mockRejectedValue(new Error('Patient not found'));

      await expect(
        service.create({
          patientId: 1,
          doctorId: 1,
          availabilityId: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if doctor does not exist', async () => {
      mockPatientRepository.getOnePatient.mockResolvedValue({ id: 1, nom: 'Patient 1' });
      mockMedecinRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          patientId: 1,
          doctorId: 99,
          availabilityId: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if availability does not exist', async () => {
      mockPatientRepository.getOnePatient.mockResolvedValue({ id: 1, nom: 'Patient 1' });
      mockMedecinRepository.findOne.mockResolvedValue({ id: 1, nom: 'Doctor 1' });
      mockAvailabilityRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          patientId: 1,
          doctorId: 1,
          availabilityId: 99,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if availability belongs to another doctor', async () => {
      mockPatientRepository.getOnePatient.mockResolvedValue({ id: 1, nom: 'Patient 1' });
      mockMedecinRepository.findOne.mockResolvedValue({ id: 1, nom: 'Doctor 1' });
      mockAvailabilityRepository.findOne.mockResolvedValue({ id: 10, doctorId: 2 });

      await expect(
        service.create({
          patientId: 1,
          doctorId: 1,
          availabilityId: 10,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if availability is already booked', async () => {
      mockPatientRepository.getOnePatient.mockResolvedValue({ id: 1, nom: 'Patient 1' });
      mockMedecinRepository.findOne.mockResolvedValue({ id: 1, nom: 'Doctor 1' });
      mockAvailabilityRepository.findOne.mockResolvedValue({ id: 10, doctorId: 1 });
      mockAppointmentRepository.findByAvailabilityId.mockResolvedValue({ id: 5, patientId: 2 });

      await expect(
        service.create({
          patientId: 1,
          doctorId: 1,
          availabilityId: 10,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create appointment successfully when all conditions are met', async () => {
      const dto = { patientId: 1, doctorId: 1, availabilityId: 10 };
      const createdAppointment = { id: 100, ...dto, statut: AppointmentStatus.PENDING };

      mockPatientRepository.getOnePatient.mockResolvedValue({ id: 1, nom: 'Patient 1' });
      mockMedecinRepository.findOne.mockResolvedValue({ id: 1, nom: 'Doctor 1' });
      mockAvailabilityRepository.findOne.mockResolvedValue({ id: 10, doctorId: 1 });
      mockAppointmentRepository.findByAvailabilityId.mockResolvedValue(null);
      mockAppointmentRepository.create.mockResolvedValue(createdAppointment);

      const result = await service.create(dto);

      expect(mockAppointmentRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdAppointment);
    });
  });

  describe('findOne', () => {
    it('should return appointment if found', async () => {
      const appointment = { id: 1, patientId: 1, doctorId: 1, availabilityId: 10 };
      mockAppointmentRepository.findOne.mockResolvedValue(appointment);

      const result = await service.findOne(1);
      expect(result).toEqual(appointment);
    });

    it('should throw NotFoundException if not found', async () => {
      mockAppointmentRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove appointment if found', async () => {
      const appointment = { id: 1, patientId: 1, doctorId: 1, availabilityId: 10 };
      mockAppointmentRepository.findOne.mockResolvedValue(appointment);
      mockAppointmentRepository.remove.mockResolvedValue(appointment);

      const result = await service.remove(1);
      expect(mockAppointmentRepository.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(appointment);
    });
  });
});
