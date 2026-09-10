import { Module } from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { AvailabilitiesController } from './availabilities.controller';
import { PrismaAvailabilityRepository } from './repositories/prisma-availability.repository';
import { AvailabilityRepository } from './repositories/availability.repository';
import { MedecinsModule } from '../medecins/medecins.module';

@Module({
  imports: [MedecinsModule],
  controllers: [AvailabilitiesController],
  providers: [
    AvailabilitiesService,
    PrismaAvailabilityRepository,
    { provide: AvailabilityRepository, useClass: PrismaAvailabilityRepository },
  ],
  exports: [AvailabilitiesService, AvailabilityRepository],
})
export class AvailabilitiesModule {}

