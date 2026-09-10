import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AppointmentStatus } from '@prisma/client';

export class FilterAppointmentDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  patientId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  doctorId?: number;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  statut?: AppointmentStatus;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
