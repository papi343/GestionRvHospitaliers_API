import { Specialty } from '@prisma/client';
import { CreateSpecialtyDto } from '../dto/create-specialty.dto';
import { UpdateSpecialtyDto } from '../dto/update-specialty.dto';

export abstract class SpecialtyRepository {
  abstract create(createSpecialtyDto: CreateSpecialtyDto): Promise<Specialty>;
  abstract findAll(): Promise<Specialty[]>;
  abstract findOne(id: number): Promise<Specialty | null>;
  abstract findByName(name: string): Promise<Specialty | null>;
  abstract update(id: number, updateSpecialtyDto: UpdateSpecialtyDto): Promise<Specialty>;
  abstract remove(id: number): Promise<Specialty>;
}
