import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let service: any;

  beforeEach(async () => {
    const mockAppointmentService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findFiltered: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        { provide: AppointmentService, useValue: mockAppointmentService },
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call appointmentService.create', async () => {
      const dto = { patientId: 1, doctorId: 1, availabilityId: 10 };
      const expected = { id: 1, ...dto };
      service.create.mockResolvedValue(expected);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should call appointmentService.findAll when no filters provided', async () => {
      service.findAll.mockResolvedValue([]);
      const result = await controller.findAll({});
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should call appointmentService.findFiltered when query filter provided', async () => {
      const filter = { doctorId: 1 };
      service.findFiltered.mockResolvedValue([]);

      const result = await controller.findAll(filter);
      expect(service.findFiltered).toHaveBeenCalledWith(filter);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should call appointmentService.findOne', async () => {
      const expected = { id: 1, patientId: 1 };
      service.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should call appointmentService.update', async () => {
      const dto = { statut: 'CONFIRMED' as any };
      const expected = { id: 1, statut: 'CONFIRMED' };
      service.update.mockResolvedValue(expected);

      const result = await controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should call appointmentService.remove', async () => {
      const expected = { id: 1 };
      service.remove.mockResolvedValue(expected);

      const result = await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });
});
