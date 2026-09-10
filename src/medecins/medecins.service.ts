import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { MedecinRepository } from './repositories/medecin.repository';
import { CreateMedecinDto } from './dto/create-medecin.dto';
import { UpdateMedecinDto } from './dto/update-medecin.dto';

@Injectable()
export class MedecinsService {
  constructor(private readonly medecinRepository: MedecinRepository) {}

  async create(createMedecinDto: CreateMedecinDto) {
    const existingLicence = await this.medecinRepository.findByLicence(createMedecinDto.licence);
    if (existingLicence) {
      throw new ConflictException(`Un médecin avec le numéro de licence '${createMedecinDto.licence}' existe déjà.`);
    }

    const existingUser = await this.medecinRepository.findByUserId(createMedecinDto.userId);
    if (existingUser) {
      throw new ConflictException(`Un profil médecin existe déjà pour l'utilisateur #${createMedecinDto.userId}.`);
    }

    return this.medecinRepository.create(createMedecinDto);
  }

  async findAll() {
    return this.medecinRepository.findAll();
  }

  async findOne(id: number) {
    const medecin = await this.medecinRepository.findOne(id);
    if (!medecin) {
      throw new NotFoundException(`Médecin #${id} introuvable.`);
    }
    return medecin;
  }

  async update(id: number, updateMedecinDto: UpdateMedecinDto) {
    await this.findOne(id);

    if (updateMedecinDto.licence) {
      const existing = await this.medecinRepository.findByLicence(updateMedecinDto.licence);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Un médecin avec le numéro de licence '${updateMedecinDto.licence}' existe déjà.`);
      }
    }

    return this.medecinRepository.update(id, updateMedecinDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.medecinRepository.remove(id);
  }

  async setSpecialties(doctorId: number, specialtyIds: number[]) {
    await this.findOne(doctorId);
    return this.medecinRepository.setSpecialties(doctorId, specialtyIds);
  }
}
