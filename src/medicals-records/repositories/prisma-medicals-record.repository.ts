import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MedicalsRecordRepository, MedicalRecordWithRelations } from './medicals-record.repository';
import { CreateMedicalsRecordDto } from '../dto/create-medicals-record.dto';
import { UpdateMedicalsRecordDto } from '../dto/update-medicals-record.dto';

const defaultInclude = {
  appointment: {
    select: {
      id: true,
      statut: true,
      patient: {
        select: { id: true, nom: true, dateNaissance: true },
      },
      doctor: {
        select: { id: true, nom: true, licence: true },
      },
      availability: {
        select: { id: true, start: true, end: true },
      },
    },
  },
};

@Injectable()
export class PrismaMedicalsRecordRepository implements MedicalsRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateMedicalsRecordDto): Promise<MedicalRecordWithRelations> {
    return this.prisma.medicalRecord.create({
      data: {
        appointmentId: createDto.appointmentId,
        diagnostic: createDto.diagnostic,
      },
      include: defaultInclude,
    });
  }

  async findAll(): Promise<MedicalRecordWithRelations[]> {
    return this.prisma.medicalRecord.findMany({
      include: defaultInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<MedicalRecordWithRelations | null> {
    return this.prisma.medicalRecord.findUnique({
      where: { id },
      include: defaultInclude,
    });
  }

  async findByAppointmentId(appointmentId: number): Promise<MedicalRecordWithRelations | null> {
    return this.prisma.medicalRecord.findUnique({
      where: { appointmentId },
      include: defaultInclude,
    });
  }

  async update(id: number, updateDto: UpdateMedicalsRecordDto): Promise<MedicalRecordWithRelations> {
    const data: any = {};
    if (updateDto.diagnostic !== undefined) data.diagnostic = updateDto.diagnostic;
    if (updateDto.appointmentId !== undefined) data.appointmentId = updateDto.appointmentId;

    return this.prisma.medicalRecord.update({
      where: { id },
      data,
      include: defaultInclude,
    });
  }

  async remove(id: number): Promise<MedicalRecordWithRelations> {
    return this.prisma.medicalRecord.delete({
      where: { id },
      include: defaultInclude,
    });
  }
}
