import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientRepository } from './repositories/patient.repository';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(private readonly patientRepository: PatientRepository) {}

  create(createPatientDto: CreatePatientDto) {
    return 'This action adds a new patient';
  }

  async findAll() {
    return this.patientRepository.getAllPatients();
  }

  async findOne(id: number) {
    try {
      return await this.patientRepository.getOnePatient(id);
    } catch {
      throw new NotFoundException(`Patient #${id} introuvable.`);
    }
  }

  async findByUserId(userId: number) {
    try {
      return await this.patientRepository.getPatientByUserId(userId);
    } catch {
      throw new NotFoundException(`Patient pour l'utilisateur #${userId} introuvable.`);
    }
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const current = await this.findOne(id);
    const updatedEntity = new Patient(
      current.id,
      updatePatientDto.nom ?? current.nom,
      updatePatientDto.dateNaissance ? new Date(updatePatientDto.dateNaissance) : current.dateNaissance,
      current.userId,
      current.createdAt,
      new Date(),
    );
    return this.patientRepository.update(id, updatedEntity);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.patientRepository.remove(id);
  }
}
