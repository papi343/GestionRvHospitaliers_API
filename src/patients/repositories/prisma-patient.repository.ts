import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { Patient } from "../entities/patient.entity";
import { PatientRepository } from "./patient.repository";

@Injectable()
export class PrismaPatientRepository implements PatientRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(patient: Patient, tx?: Prisma.TransactionClient): Promise<Patient> {
        const client = tx ?? this.prisma;
        const created = await client.patient.create({
            data: {
                nom: patient.nom,
                dateNaissance: patient.dateNaissance,
                userId: patient.userId,
            }
        });
        return new Patient(
            created.id,
            created.nom,
            created.dateNaissance,
            created.userId,
            created.createdAt,
            created.updatedAt
        );
    }

    async getAllPatients(): Promise<Patient[]> {
        const patients = await this.prisma.patient.findMany();
        return patients.map(
            (p) => new Patient(p.id, p.nom, p.dateNaissance, p.userId, p.createdAt, p.updatedAt)
        );
    }

    async getOnePatient(id: number): Promise<Patient> {
        const patient = await this.prisma.patient.findUnique({ where: { id } });
        if (!patient) throw new Error("Patient not found");
        return new Patient(
            patient.id,
            patient.nom,
            patient.dateNaissance,
            patient.userId,
            patient.createdAt,
            patient.updatedAt
        );
    }

    async getPatientByUserId(userId: number): Promise<Patient> {
        const patient = await this.prisma.patient.findUnique({ where: { userId } });
        if (!patient) throw new Error("Patient not found");
        return new Patient(
            patient.id,
            patient.nom,
            patient.dateNaissance,
            patient.userId,
            patient.createdAt,
            patient.updatedAt
        );
    }

    async update(id: number, patient: Patient): Promise<Patient> {
        const updated = await this.prisma.patient.update({
            where: { id },
            data: {
                nom: patient.nom,
                dateNaissance: patient.dateNaissance,
            }
        });
        return new Patient(
            updated.id,
            updated.nom,
            updated.dateNaissance,
            updated.userId,
            updated.createdAt,
            updated.updatedAt
        );
    }

    async remove(id: number): Promise<Patient> {
        const deleted = await this.prisma.patient.delete({ where: { id } });
        if (!deleted) throw new Error("Patient not found");
        return new Patient(
            deleted.id,
            deleted.nom,
            deleted.dateNaissance,
            deleted.userId,
            deleted.createdAt,
            deleted.updatedAt
        );
    }
}
