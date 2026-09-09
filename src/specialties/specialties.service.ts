import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { SpecialtyRepository } from './repositories/specialty.repository';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Injectable()
export class SpecialtiesService {
  constructor(private readonly specialtyRepository: SpecialtyRepository) {}

  async create(createSpecialtyDto: CreateSpecialtyDto) {
    const existing = await this.specialtyRepository.findByName(createSpecialtyDto.name);
    if (existing) {
      throw new ConflictException(`La spécialité '${createSpecialtyDto.name}' existe déjà.`);
    }
    return this.specialtyRepository.create(createSpecialtyDto);
  }

  async findAll() {
    return this.specialtyRepository.findAll();
  }

  async findOne(id: number) {
    const specialty = await this.specialtyRepository.findOne(id);
    if (!specialty) {
      throw new NotFoundException(`Spécialité #${id} introuvable.`);
    }
    return specialty;
  }

  async update(id: number, updateSpecialtyDto: UpdateSpecialtyDto) {
    await this.findOne(id);
    if (updateSpecialtyDto.name) {
      const existing = await this.specialtyRepository.findByName(updateSpecialtyDto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(`La spécialité '${updateSpecialtyDto.name}' existe déjà.`);
      }
    }
    return this.specialtyRepository.update(id, updateSpecialtyDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.specialtyRepository.remove(id);
  }
}
