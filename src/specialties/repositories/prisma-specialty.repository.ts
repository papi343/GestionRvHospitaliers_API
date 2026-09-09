import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SpecialtyRepository } from './specialty.repository';
import { CreateSpecialtyDto } from '../dto/create-specialty.dto';
import { UpdateSpecialtyDto } from '../dto/update-specialty.dto';
import { Specialty } from '@prisma/client';

@Injectable()
export class PrismaSpecialtyRepository implements SpecialtyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpecialtyDto: CreateSpecialtyDto): Promise<Specialty> {
    return this.prisma.specialty.create({
      data: createSpecialtyDto,
    });
  }

  async findAll(): Promise<Specialty[]> {
    return this.prisma.specialty.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number): Promise<Specialty | null> {
    return this.prisma.specialty.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Specialty | null> {
    return this.prisma.specialty.findUnique({
      where: { name },
    });
  }

  async update(id: number, updateSpecialtyDto: UpdateSpecialtyDto): Promise<Specialty> {
    return this.prisma.specialty.update({
      where: { id },
      data: updateSpecialtyDto,
    });
  }

  async remove(id: number): Promise<Specialty> {
    return this.prisma.specialty.delete({
      where: { id },
    });
  }
}
