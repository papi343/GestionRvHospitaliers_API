import { Module } from '@nestjs/common';
import { MedicalsRecordsService } from './medicals-records.service';
import { MedicalsRecordsController } from './medicals-records.controller';
import { MedicalsRecordRepository } from './repositories/medicals-record.repository';
import { PrismaMedicalsRecordRepository } from './repositories/prisma-medicals-record.repository';
import { AppointmentModule } from '../appointment/appointment.module';

@Module({
  imports: [AppointmentModule],
  controllers: [MedicalsRecordsController],
  providers: [
    MedicalsRecordsService,
    PrismaMedicalsRecordRepository,
    { provide: MedicalsRecordRepository, useClass: PrismaMedicalsRecordRepository },
  ],
  exports: [MedicalsRecordsService, MedicalsRecordRepository],
})
export class MedicalsRecordsModule {}
