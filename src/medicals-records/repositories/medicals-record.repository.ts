import { MedicalRecord } from '@prisma/client';
import { CreateMedicalsRecordDto } from '../dto/create-medicals-record.dto';
import { UpdateMedicalsRecordDto } from '../dto/update-medicals-record.dto';

export type MedicalRecordWithRelations = MedicalRecord & {
  appointment?: {
    id: number;
    statut: string;
    patient?: {
      id: number;
      nom: string;
      dateNaissance: Date;
    };
    doctor?: {
      id: number;
      nom: string;
      licence: string;
    };
    availability?: {
      id: number;
      start: Date;
      end: Date;
    };
  };
};

export abstract class MedicalsRecordRepository {
  abstract create(createDto: CreateMedicalsRecordDto): Promise<MedicalRecordWithRelations>;
  abstract findAll(): Promise<MedicalRecordWithRelations[]>;
  abstract findOne(id: number): Promise<MedicalRecordWithRelations | null>;
  abstract findByAppointmentId(appointmentId: number): Promise<MedicalRecordWithRelations | null>;
  abstract update(id: number, updateDto: UpdateMedicalsRecordDto): Promise<MedicalRecordWithRelations>;
  abstract remove(id: number): Promise<MedicalRecordWithRelations>;
}
