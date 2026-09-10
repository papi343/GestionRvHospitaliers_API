import { Module } from '@nestjs/common';
import { MedecinsService } from './medecins.service';
import { MedecinsController } from './medecins.controller';
import { PrismaMedecinRepository } from './repositories/prisma-medecin.repository';
import { MedecinRepository } from './repositories/medecin.repository';

@Module({
  controllers: [MedecinsController],
  providers: [
    MedecinsService,
    PrismaMedecinRepository,
    { provide: MedecinRepository, useClass: PrismaMedecinRepository },
  ],
  exports: [MedecinRepository, MedecinsService],
})
export class MedecinsModule {}
