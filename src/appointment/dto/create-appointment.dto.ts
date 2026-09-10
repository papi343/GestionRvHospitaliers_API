import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'Le patientId est requis.' })
  @IsInt({ message: 'Le patientId doit être un entier.' })
  patientId: number;

  @IsNotEmpty({ message: 'Le doctorId est requis.' })
  @IsInt({ message: 'Le doctorId doit être un entier.' })
  doctorId: number;

  @IsNotEmpty({ message: "L'availabilityId est requis." })
  @IsInt({ message: "L'availabilityId doit être un entier." })
  availabilityId: number;

  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'Statut de rendez-vous invalide.' })
  statut?: AppointmentStatus;
}
