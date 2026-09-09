import { Module } from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { SpecialtiesController } from './specialties.controller';
import { SpecialtyRepository } from './repositories/specialty.repository';
import { PrismaSpecialtyRepository } from './repositories/prisma-specialty.repository';

@Module({
  controllers: [SpecialtiesController],
  providers: [
    SpecialtiesService,
    PrismaSpecialtyRepository,
    { provide: SpecialtyRepository, useClass: PrismaSpecialtyRepository },
  ],
  exports: [SpecialtiesService, SpecialtyRepository],
})
export class SpecialtiesModule {}
