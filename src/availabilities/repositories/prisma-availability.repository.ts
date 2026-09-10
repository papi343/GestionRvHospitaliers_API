import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AvailabilityRepository, AvailabilityWithRelations } from './availability.repository';
import { CreateAvailabilityDto } from '../dto/create-availability.dto';
import { UpdateAvailabilityDto } from '../dto/update-availability.dto';

import { FilterAvailabilityDto } from '../dto/filter-availability.dto';

@Injectable()
export class PrismaAvailabilityRepository implements AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAvailabilityDto: CreateAvailabilityDto): Promise<AvailabilityWithRelations> {
    return this.prisma.availability.create({
      data: {
        doctorId: createAvailabilityDto.doctorId,
        start: new Date(createAvailabilityDto.start),
        end: new Date(createAvailabilityDto.end),
      },
      include: {
        doctor: {
          select: { id: true, nom: true },
        },
        appointment: {
          select: { id: true, statut: true },
        },
      },
    });
  }

  async createMany(slots: { doctorId: number; start: Date; end: Date }[]): Promise<number> {
    const result = await this.prisma.availability.createMany({
      data: slots,
    });
    return result.count;
  }

  async findAll(): Promise<AvailabilityWithRelations[]> {
    return this.prisma.availability.findMany({
      include: {
        doctor: {
          select: { id: true, nom: true },
        },
        appointment: {
          select: { id: true, statut: true },
        },
      },
      orderBy: { start: 'asc' },
    });
  }

  async findFiltered(filter: FilterAvailabilityDto): Promise<AvailabilityWithRelations[]> {
    const where: any = {};

    if (filter.doctorId) {
      where.doctorId = filter.doctorId;
    }

    if (filter.startDate || filter.endDate) {
      where.AND = where.AND || [];
      if (filter.startDate) {
        where.AND.push({ start: { gte: new Date(filter.startDate) } });
      }
      if (filter.endDate) {
        where.AND.push({ end: { lte: new Date(filter.endDate) } });
      }
    }

    if (filter.isBooked !== undefined) {
      if (filter.isBooked) {
        where.appointment = { isNot: null };
      } else {
        where.appointment = null;
      }
    }

    return this.prisma.availability.findMany({
      where,
      include: {
        doctor: {
          select: { id: true, nom: true },
        },
        appointment: {
          select: { id: true, statut: true },
        },
      },
      orderBy: { start: 'asc' },
    });
  }

  async findOne(id: number): Promise<AvailabilityWithRelations | null> {
    return this.prisma.availability.findUnique({
      where: { id },
      include: {
        doctor: {
          select: { id: true, nom: true },
        },
        appointment: {
          select: { id: true, statut: true },
        },
      },
    });
  }

  async findByDoctorId(doctorId: number): Promise<AvailabilityWithRelations[]> {
    return this.prisma.availability.findMany({
      where: { doctorId },
      include: {
        doctor: {
          select: { id: true, nom: true },
        },
        appointment: {
          select: { id: true, statut: true },
        },
      },
      orderBy: { start: 'asc' },
    });
  }

  async findOverlapping(
    doctorId: number,
    start: Date,
    end: Date,
    excludeId?: number,
  ): Promise<AvailabilityWithRelations | null> {
    return this.prisma.availability.findFirst({
      where: {
        doctorId,
        id: excludeId ? { not: excludeId } : undefined,
        AND: [
          { start: { lt: end } },
          { end: { gt: start } },
        ],
      },
      include: {
        doctor: {
          select: { id: true, nom: true },
        },
        appointment: {
          select: { id: true, statut: true },
        },
      },
    });
  }

  async update(id: number, updateAvailabilityDto: UpdateAvailabilityDto): Promise<AvailabilityWithRelations> {
    const data: { start?: Date; end?: Date; doctorId?: number } = {};
    if (updateAvailabilityDto.start) data.start = new Date(updateAvailabilityDto.start);
    if (updateAvailabilityDto.end) data.end = new Date(updateAvailabilityDto.end);
    if (updateAvailabilityDto.doctorId) data.doctorId = updateAvailabilityDto.doctorId;

    return this.prisma.availability.update({
      where: { id },
      data,
      include: {
        doctor: {
          select: { id: true, nom: true },
        },
        appointment: {
          select: { id: true, statut: true },
        },
      },
    });
  }

  async remove(id: number): Promise<AvailabilityWithRelations> {
    return this.prisma.availability.delete({
      where: { id },
      include: {
        doctor: {
          select: { id: true, nom: true },
        },
        appointment: {
          select: { id: true, statut: true },
        },
      },
    });
  }
}
