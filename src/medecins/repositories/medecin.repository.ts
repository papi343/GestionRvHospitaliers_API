import { Doctor, Specialty } from '@prisma/client';
import { CreateMedecinDto } from '../dto/create-medecin.dto';
import { UpdateMedecinDto } from '../dto/update-medecin.dto';

export type MedecinWithRelations = Doctor & {
  user?: { email: string };
  specialties?: { specialty: Specialty }[];
};

export abstract class MedecinRepository {
  abstract create(createMedecinDto: CreateMedecinDto): Promise<MedecinWithRelations>;
  abstract findAll(): Promise<MedecinWithRelations[]>;
  abstract findOne(id: number): Promise<MedecinWithRelations | null>;
  abstract findByUserId(userId: number): Promise<MedecinWithRelations | null>;
  abstract findByLicence(licence: string): Promise<MedecinWithRelations | null>;
  abstract update(id: number, updateMedecinDto: UpdateMedecinDto): Promise<MedecinWithRelations>;
  abstract remove(id: number): Promise<MedecinWithRelations>;
  abstract setSpecialties(doctorId: number, specialtyIds: number[]): Promise<MedecinWithRelations>;
}
