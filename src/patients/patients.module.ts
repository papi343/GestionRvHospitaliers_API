import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { PrismaPatientRepository } from './repositories/prisma-patient.repository';
import { PatientRepository } from './repositories/patient.repository';

@Module({
  controllers: [PatientsController],
  providers: [
    PatientsService,
    PrismaPatientRepository,
    { provide: PatientRepository, useClass: PrismaPatientRepository }
  ],
  exports: [PatientRepository, PatientsService]
})
export class PatientsModule {}

