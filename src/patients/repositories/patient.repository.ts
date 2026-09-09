import { Prisma } from '@prisma/client';
import { Patient } from '../entities/patient.entity';

export abstract class PatientRepository {
    abstract create(patient: Patient, tx?: Prisma.TransactionClient): Promise<Patient>;
    abstract getAllPatients(): Promise<Patient[]>;
    abstract getOnePatient(id: number): Promise<Patient>;
    abstract getPatientByUserId(userId: number): Promise<Patient>;
    abstract update(id: number, patient: Patient): Promise<Patient>;
    abstract remove(id: number): Promise<Patient>;
}
