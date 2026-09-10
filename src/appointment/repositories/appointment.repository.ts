import { Appointment } from '@prisma/client';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { FilterAppointmentDto } from '../dto/filter-appointment.dto';

export type AppointmentWithRelations = Appointment & {
  patient?: {
    id: number;
    nom: string;
    dateNaissance: Date;
  };
  doctor?: {
    id: number;
    nom: string;
    licence: string;
  };
  availability?: {
    id: number;
    start: Date;
    end: Date;
  };
  medicalRecord?: {
    id: number;
    diagnostic: string;
  } | null;
};

export abstract class AppointmentRepository {
  abstract create(createAppointmentDto: CreateAppointmentDto): Promise<AppointmentWithRelations>;
  abstract findAll(): Promise<AppointmentWithRelations[]>;
  abstract findFiltered(filter: FilterAppointmentDto): Promise<AppointmentWithRelations[]>;
  abstract findOne(id: number): Promise<AppointmentWithRelations | null>;
  abstract findByAvailabilityId(availabilityId: number): Promise<AppointmentWithRelations | null>;
  abstract update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<AppointmentWithRelations>;
  abstract remove(id: number): Promise<AppointmentWithRelations>;
}
