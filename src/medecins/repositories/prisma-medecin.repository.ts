import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MedecinRepository, MedecinWithRelations } from './medecin.repository';
import { CreateMedecinDto } from '../dto/create-medecin.dto';
import { UpdateMedecinDto } from '../dto/update-medecin.dto';
import bcrypt from 'bcrypt'
import { Role } from '@prisma/client'


const medecinInclude = {
  user: {
    select: {
      id: true,
      email: true,
      role: true,

    },
  },
  specialties: {
    include: {
      specialty: true,
    },
  },
};

@Injectable()
export class PrismaMedecinRepository implements MedecinRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(createMedecinDto: CreateMedecinDto): Promise<MedecinWithRelations> {
    createMedecinDto.password = await bcrypt.hash(createMedecinDto.password, 10)
    const { nom, licence, specialtyIds, email, password } = createMedecinDto;

    return this.prisma.doctor.create({
      data: {
        nom,
        licence,
        //creation de user
        user: {
          create: {
            email,
            password,
            role: Role.DOCTOR
          },
        },
        specialties:
          specialtyIds && specialtyIds.length > 0
            ? {
              create: specialtyIds.map((specialtyId) => ({
                specialty: { connect: { id: specialtyId } },
              })),
            }
            : undefined,
      },
      include: medecinInclude,
    });
  }

  async findAll(): Promise<MedecinWithRelations[]> {
    return this.prisma.doctor.findMany({
      include: medecinInclude,
    });
  }

  async findOne(id: number): Promise<MedecinWithRelations | null> {
    return this.prisma.doctor.findUnique({
      where: { id },
      include: medecinInclude,
    });
  }

  async findByUserId(userId: number): Promise<MedecinWithRelations | null> {
    return this.prisma.doctor.findUnique({
      where: { userId },
      include: medecinInclude,
    });
  }

  async findByLicence(licence: string): Promise<MedecinWithRelations | null> {
    return this.prisma.doctor.findUnique({
      where: { licence },
      include: medecinInclude,
    });
  }

  async update(id: number, updateMedecinDto: UpdateMedecinDto): Promise<MedecinWithRelations> {
    const { nom, licence, specialtyIds } = updateMedecinDto;

    if (specialtyIds !== undefined) {
      await this.prisma.doctorSpecialty.deleteMany({
        where: { doctorId: id },
      });
    }

    return this.prisma.doctor.update({
      where: { id },
      data: {
        nom,
        licence,
        specialties:
          specialtyIds !== undefined && specialtyIds.length > 0
            ? {
              create: specialtyIds.map((specialtyId) => ({
                specialty: { connect: { id: specialtyId } },
              })),
            }
            : undefined,
      },
      include: medecinInclude,
    });
  }

  async remove(id: number): Promise<MedecinWithRelations> {
    return this.prisma.doctor.delete({
      where: { id },
      include: medecinInclude,
    });
  }

  async setSpecialties(doctorId: number, specialtyIds: number[]): Promise<MedecinWithRelations> {
    await this.prisma.doctorSpecialty.deleteMany({
      where: { doctorId },
    });

    return this.prisma.doctor.update({
      where: { id: doctorId },
      data: {
        specialties: {
          create: specialtyIds.map((specialtyId) => ({
            specialty: { connect: { id: specialtyId } },
          })),
        },
      },
      include: medecinInclude,
    });
  }
}
