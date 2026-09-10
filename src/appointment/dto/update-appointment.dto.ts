import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsInt({ message: 'Le patientId doit être un entier.' })
  patientId?: number;

  @IsOptional()
  @IsInt({ message: 'Le doctorId doit être un entier.' })
  doctorId?: number;

  @IsOptional()
  @IsInt({ message: "L'availabilityId doit être un entier." })
  availabilityId?: number;

  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'Statut de rendez-vous invalide.' })
  statut?: AppointmentStatus;
}
