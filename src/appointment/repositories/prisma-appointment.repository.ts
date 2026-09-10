import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentRepository, AppointmentWithRelations } from './appointment.repository';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { FilterAppointmentDto } from '../dto/filter-appointment.dto';

const defaultInclude = {
  patient: {
    select: { id: true, nom: true, dateNaissance: true },
  },
  doctor: {
    select: { id: true, nom: true, licence: true },
  },
  availability: {
    select: { id: true, start: true, end: true },
  },
  medicalRecord: {
    select: { id: true, diagnostic: true },
  },
};

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentWithRelations> {
    return this.prisma.appointment.create({
      data: {
        patientId: createAppointmentDto.patientId,
        doctorId: createAppointmentDto.doctorId,
        availabilityId: createAppointmentDto.availabilityId,
        statut: createAppointmentDto.statut,
      },
      include: defaultInclude,
    });
  }

  async findAll(): Promise<AppointmentWithRelations[]> {
    return this.prisma.appointment.findMany({
      include: defaultInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFiltered(filter: FilterAppointmentDto): Promise<AppointmentWithRelations[]> {
    const where: any = {};

    if (filter.patientId) {
      where.patientId = filter.patientId;
    }

    if (filter.doctorId) {
      where.doctorId = filter.doctorId;
    }

    if (filter.statut) {
      where.statut = filter.statut;
    }

    if (filter.startDate || filter.endDate) {
      where.availability = where.availability || {};
      if (filter.startDate) {
        where.availability.start = { gte: new Date(filter.startDate) };
      }
      if (filter.endDate) {
        where.availability.end = { lte: new Date(filter.endDate) };
      }
    }

    return this.prisma.appointment.findMany({
      where,
      include: defaultInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<AppointmentWithRelations | null> {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: defaultInclude,
    });
  }

  async findByAvailabilityId(availabilityId: number): Promise<AppointmentWithRelations | null> {
    return this.prisma.appointment.findUnique({
      where: { availabilityId },
      include: defaultInclude,
    });
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentWithRelations> {
    const data: any = {};
    if (updateAppointmentDto.patientId !== undefined) data.patientId = updateAppointmentDto.patientId;
    if (updateAppointmentDto.doctorId !== undefined) data.doctorId = updateAppointmentDto.doctorId;
    if (updateAppointmentDto.availabilityId !== undefined) data.availabilityId = updateAppointmentDto.availabilityId;
    if (updateAppointmentDto.statut !== undefined) data.statut = updateAppointmentDto.statut;

    return this.prisma.appointment.update({
      where: { id },
      data,
      include: defaultInclude,
    });
  }

  async remove(id: number): Promise<AppointmentWithRelations> {
    return this.prisma.appointment.delete({
      where: { id },
      include: defaultInclude,
    });
  }
}
