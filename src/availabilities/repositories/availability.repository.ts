import { Availability } from '@prisma/client';
import { CreateAvailabilityDto } from '../dto/create-availability.dto';
import { UpdateAvailabilityDto } from '../dto/update-availability.dto';

import { FilterAvailabilityDto } from '../dto/filter-availability.dto';

export type AvailabilityWithRelations = Availability & {
  doctor?: {
    id: number;
    nom: string;
  };
  appointment?: {
    id: number;
    statut: string;
  } | null;
};

export abstract class AvailabilityRepository {
  abstract create(createAvailabilityDto: CreateAvailabilityDto): Promise<AvailabilityWithRelations>;
  abstract createMany(slots: { doctorId: number; start: Date; end: Date }[]): Promise<number>;
  abstract findAll(): Promise<AvailabilityWithRelations[]>;
  abstract findFiltered(filter: FilterAvailabilityDto): Promise<AvailabilityWithRelations[]>;
  abstract findOne(id: number): Promise<AvailabilityWithRelations | null>;
  abstract findByDoctorId(doctorId: number): Promise<AvailabilityWithRelations[]>;
  abstract findOverlapping(
    doctorId: number,
    start: Date,
    end: Date,
    excludeId?: number,
  ): Promise<AvailabilityWithRelations | null>;
  abstract update(id: number, updateAvailabilityDto: UpdateAvailabilityDto): Promise<AvailabilityWithRelations>;
  abstract remove(id: number): Promise<AvailabilityWithRelations>;
}
