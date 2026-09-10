import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { MedicalsRecordRepository } from './repositories/medicals-record.repository';
import { AppointmentRepository } from '../appointment/repositories/appointment.repository';
import { CreateMedicalsRecordDto } from './dto/create-medicals-record.dto';
import { UpdateMedicalsRecordDto } from './dto/update-medicals-record.dto';

@Injectable()
export class MedicalsRecordsService {
  constructor(
    private readonly medicalsRecordRepository: MedicalsRecordRepository,
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async create(createDto: CreateMedicalsRecordDto) {
    const appointment = await this.appointmentRepository.findOne(createDto.appointmentId);
    if (!appointment) {
      throw new NotFoundException(`Rendez-vous #${createDto.appointmentId} introuvable.`);
    }

    const existingRecord = await this.medicalsRecordRepository.findByAppointmentId(createDto.appointmentId);
    if (existingRecord) {
      throw new ConflictException(`Un dossier médical existe déjà pour le rendez-vous #${createDto.appointmentId}.`);
    }

    return this.medicalsRecordRepository.create(createDto);
  }

  async findAll() {
    return this.medicalsRecordRepository.findAll();
  }

  async findOne(id: number) {
    const record = await this.medicalsRecordRepository.findOne(id);
    if (!record) {
      throw new NotFoundException(`Dossier médical #${id} introuvable.`);
    }
    return record;
  }

  async findByAppointmentId(appointmentId: number) {
    const appointment = await this.appointmentRepository.findOne(appointmentId);
    if (!appointment) {
      throw new NotFoundException(`Rendez-vous #${appointmentId} introuvable.`);
    }

    const record = await this.medicalsRecordRepository.findByAppointmentId(appointmentId);
    if (!record) {
      throw new NotFoundException(`Aucun dossier médical trouvé pour le rendez-vous #${appointmentId}.`);
    }
    return record;
  }

  async update(id: number, updateDto: UpdateMedicalsRecordDto) {
    const currentRecord = await this.findOne(id);

    if (updateDto.appointmentId && updateDto.appointmentId !== currentRecord.appointmentId) {
      const appointment = await this.appointmentRepository.findOne(updateDto.appointmentId);
      if (!appointment) {
        throw new NotFoundException(`Rendez-vous #${updateDto.appointmentId} introuvable.`);
      }

      const existingRecord = await this.medicalsRecordRepository.findByAppointmentId(updateDto.appointmentId);
      if (existingRecord && existingRecord.id !== id) {
        throw new ConflictException(
          `Un dossier médical existe déjà pour le rendez-vous #${updateDto.appointmentId}.`,
        );
      }
    }

    return this.medicalsRecordRepository.update(id, updateDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.medicalsRecordRepository.remove(id);
  }
}
