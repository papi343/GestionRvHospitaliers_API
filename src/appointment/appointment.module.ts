import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaAppointmentRepository } from './repositories/prisma-appointment.repository';
import { AppointmentRepository } from './repositories/appointment.repository';
import { PatientsModule } from '../patients/patients.module';
import { MedecinsModule } from '../medecins/medecins.module';
import { AvailabilitiesModule } from '../availabilities/availabilities.module';

@Module({
  imports: [PatientsModule, MedecinsModule, AvailabilitiesModule],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    PrismaAppointmentRepository,
    { provide: AppointmentRepository, useClass: PrismaAppointmentRepository },
  ],
  exports: [AppointmentService, AppointmentRepository],
})
export class AppointmentModule {}
