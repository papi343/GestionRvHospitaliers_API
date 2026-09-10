import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { AppointmentRepository } from './repositories/appointment.repository';
import { PatientRepository } from '../patients/repositories/patient.repository';
import { MedecinRepository } from '../medecins/repositories/medecin.repository';
import { AvailabilityRepository } from '../availabilities/repositories/availability.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { FilterAppointmentDto } from './dto/filter-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly patientRepository: PatientRepository,
    private readonly medecinRepository: MedecinRepository,
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  private async findPatientById(id: number) {
    try {
      return await this.patientRepository.getOnePatient(id);
    } catch {
      return null;
    }
  }

  async create(createAppointmentDto: CreateAppointmentDto) {
    const patient = await this.findPatientById(createAppointmentDto.patientId);
    if (!patient) {
      throw new NotFoundException(`Patient #${createAppointmentDto.patientId} introuvable.`);
    }

    const doctor = await this.medecinRepository.findOne(createAppointmentDto.doctorId);
    if (!doctor) {
      throw new NotFoundException(`Médecin #${createAppointmentDto.doctorId} introuvable.`);
    }

    const availability = await this.availabilityRepository.findOne(createAppointmentDto.availabilityId);
    if (!availability) {
      throw new NotFoundException(`Disponibilité #${createAppointmentDto.availabilityId} introuvable.`);
    }

    if (availability.doctorId !== createAppointmentDto.doctorId) {
      throw new BadRequestException(
        `La disponibilité #${createAppointmentDto.availabilityId} n'appartient pas au médecin #${createAppointmentDto.doctorId}.`,
      );
    }

    const existingAppointment = await this.appointmentRepository.findByAvailabilityId(
      createAppointmentDto.availabilityId,
    );
    if (existingAppointment || availability.appointment) {
      throw new ConflictException('Cette disponibilité est déjà réservée par un autre rendez-vous.');
    }

    return this.appointmentRepository.create(createAppointmentDto);
  }

  async findAll() {
    return this.appointmentRepository.findAll();
  }

  async findFiltered(filter: FilterAppointmentDto) {
    if (filter.patientId) {
      const patient = await this.findPatientById(filter.patientId);
      if (!patient) {
        throw new NotFoundException(`Patient #${filter.patientId} introuvable.`);
      }
    }

    if (filter.doctorId) {
      const doctor = await this.medecinRepository.findOne(filter.doctorId);
      if (!doctor) {
        throw new NotFoundException(`Médecin #${filter.doctorId} introuvable.`);
      }
    }

    return this.appointmentRepository.findFiltered(filter);
  }

  async findOne(id: number) {
    const appointment = await this.appointmentRepository.findOne(id);
    if (!appointment) {
      throw new NotFoundException(`Rendez-vous #${id} introuvable.`);
    }
    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const current = await this.findOne(id);

    const patientId = updateAppointmentDto.patientId ?? current.patientId;
    const doctorId = updateAppointmentDto.doctorId ?? current.doctorId;
    const availabilityId = updateAppointmentDto.availabilityId ?? current.availabilityId;

    if (updateAppointmentDto.patientId) {
      const patient = await this.findPatientById(patientId);
      if (!patient) {
        throw new NotFoundException(`Patient #${patientId} introuvable.`);
      }
    }

    if (updateAppointmentDto.doctorId) {
      const doctor = await this.medecinRepository.findOne(doctorId);
      if (!doctor) {
        throw new NotFoundException(`Médecin #${doctorId} introuvable.`);
      }
    }

    if (updateAppointmentDto.availabilityId || updateAppointmentDto.doctorId) {
      const availability = await this.availabilityRepository.findOne(availabilityId);
      if (!availability) {
        throw new NotFoundException(`Disponibilité #${availabilityId} introuvable.`);
      }

      if (availability.doctorId !== doctorId) {
        throw new BadRequestException(
          `La disponibilité #${availabilityId} n'appartient pas au médecin #${doctorId}.`,
        );
      }

      const existingAppointment = await this.appointmentRepository.findByAvailabilityId(availabilityId);
      if (existingAppointment && existingAppointment.id !== id) {
        throw new ConflictException('Cette disponibilité est déjà réservée par un autre rendez-vous.');
      }
    }

    return this.appointmentRepository.update(id, updateAppointmentDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.appointmentRepository.remove(id);
  }
}
