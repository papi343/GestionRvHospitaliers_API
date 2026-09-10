import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { AvailabilityRepository } from './repositories/availability.repository';
import { MedecinRepository } from '../medecins/repositories/medecin.repository';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

import { CreateBulkAvailabilityDto } from './dto/create-bulk-availability.dto';
import { FilterAvailabilityDto } from './dto/filter-availability.dto';

@Injectable()
export class AvailabilitiesService {
  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly medecinRepository: MedecinRepository,
  ) {}

  async create(createAvailabilityDto: CreateAvailabilityDto) {
    const start = new Date(createAvailabilityDto.start);
    const end = new Date(createAvailabilityDto.end);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Format de date invalide.');
    }

    if (start >= end) {
      throw new BadRequestException("La date de début doit être antérieure à la date de fin.");
    }

    const doctor = await this.medecinRepository.findOne(createAvailabilityDto.doctorId);
    if (!doctor) {
      throw new NotFoundException(`Médecin #${createAvailabilityDto.doctorId} introuvable.`);
    }

    const overlapping = await this.availabilityRepository.findOverlapping(
      createAvailabilityDto.doctorId,
      start,
      end,
    );

    if (overlapping) {
      throw new ConflictException(
        `Une disponibilité chevauche déjà ce créneau pour le médecin #${createAvailabilityDto.doctorId}.`,
      );
    }

    return this.availabilityRepository.create(createAvailabilityDto);
  }

  async createBulk(dto: CreateBulkAvailabilityDto) {
    const doctor = await this.medecinRepository.findOne(dto.doctorId);
    if (!doctor) {
      throw new NotFoundException(`Médecin #${dto.doctorId} introuvable.`);
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Date de début ou de fin invalide.');
    }

    if (startDate > endDate) {
      throw new BadRequestException('La date de début doit être antérieure ou égale à la date de fin.');
    }

    const daysOfWeek = dto.daysOfWeek && dto.daysOfWeek.length > 0
      ? dto.daysOfWeek
      : [1, 2, 3, 4, 5]; // Par défaut Lundi au Vendredi

    const parseTimeToMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = parseTimeToMinutes(dto.startTime);
    const endMinutes = parseTimeToMinutes(dto.endTime);

    if (startMinutes >= endMinutes) {
      throw new BadRequestException("L'heure de début quotidienne doit être inférieure à l'heure de fin.");
    }

    let breakStartMinutes: number | null = null;
    let breakEndMinutes: number | null = null;

    if (dto.breakStartTime && dto.breakEndTime) {
      breakStartMinutes = parseTimeToMinutes(dto.breakStartTime);
      breakEndMinutes = parseTimeToMinutes(dto.breakEndTime);

      if (breakStartMinutes >= breakEndMinutes) {
        throw new BadRequestException("L'heure de début de pause doit être inférieure à l'heure de fin de pause.");
      }
    }

    const slotsToCreate: { doctorId: number; start: Date; end: Date }[] = [];
    let skippedCount = 0;

    const currentDate = new Date(startDate);
    // On s'assure qu'on commence à 00:00:00 du premier jour
    currentDate.setHours(0, 0, 0, 0);

    const endLimitDate = new Date(endDate);
    endLimitDate.setHours(23, 59, 59, 999);

    while (currentDate <= endLimitDate) {
      const dayOfWeek = currentDate.getDay(); // 0 = Dimanche, 1 = Lundi, etc.

      if (daysOfWeek.includes(dayOfWeek)) {
        let currentSlotStartMinutes = startMinutes;

        while (currentSlotStartMinutes + dto.slotDurationMinutes <= endMinutes) {
          const currentSlotEndMinutes = currentSlotStartMinutes + dto.slotDurationMinutes;

          // Vérifier si le créneau tombe pendant la pause
          const isInBreak =
            breakStartMinutes !== null &&
            breakEndMinutes !== null &&
            !(currentSlotEndMinutes <= breakStartMinutes || currentSlotStartMinutes >= breakEndMinutes);

          if (!isInBreak) {
            const slotStart = new Date(currentDate);
            slotStart.setHours(Math.floor(currentSlotStartMinutes / 60), currentSlotStartMinutes % 60, 0, 0);

            const slotEnd = new Date(currentDate);
            slotEnd.setHours(Math.floor(currentSlotEndMinutes / 60), currentSlotEndMinutes % 60, 0, 0);

            // Vérifier chevauchement avec créneaux déjà existants
            const overlapping = await this.availabilityRepository.findOverlapping(
              dto.doctorId,
              slotStart,
              slotEnd,
            );

            if (!overlapping) {
              slotsToCreate.push({
                doctorId: dto.doctorId,
                start: slotStart,
                end: slotEnd,
              });
            } else {
              skippedCount++;
            }
          }

          currentSlotStartMinutes += dto.slotDurationMinutes;
        }
      }

      // Passer au jour suivant
      currentDate.setDate(currentDate.getDate() + 1);
    }

    let createdCount = 0;
    if (slotsToCreate.length > 0) {
      createdCount = await this.availabilityRepository.createMany(slotsToCreate);
    }

    return {
      message: `${createdCount} créneaux de disponibilité ont été créés avec succès.`,
      createdCount,
      skippedCount,
      totalGenerated: slotsToCreate.length + skippedCount,
    };
  }

  async findAll() {
    return this.availabilityRepository.findAll();
  }

  async findFiltered(filter: FilterAvailabilityDto) {
    if (filter.doctorId) {
      const doctor = await this.medecinRepository.findOne(filter.doctorId);
      if (!doctor) {
        throw new NotFoundException(`Médecin #${filter.doctorId} introuvable.`);
      }
    }
    return this.availabilityRepository.findFiltered(filter);
  }

  async findOne(id: number) {
    const availability = await this.availabilityRepository.findOne(id);
    if (!availability) {
      throw new NotFoundException(`Disponibilité #${id} introuvable.`);
    }
    return availability;
  }

  async findByDoctorId(doctorId: number) {
    const doctor = await this.medecinRepository.findOne(doctorId);
    if (!doctor) {
      throw new NotFoundException(`Médecin #${doctorId} introuvable.`);
    }
    return this.availabilityRepository.findByDoctorId(doctorId);
  }

  async update(id: number, updateAvailabilityDto: UpdateAvailabilityDto) {
    const current = await this.findOne(id);

    const doctorId = updateAvailabilityDto.doctorId ?? current.doctorId;
    const start = updateAvailabilityDto.start ? new Date(updateAvailabilityDto.start) : current.start;
    const end = updateAvailabilityDto.end ? new Date(updateAvailabilityDto.end) : current.end;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Format de date invalide.');
    }

    if (start >= end) {
      throw new BadRequestException("La date de début doit être antérieure à la date de fin.");
    }

    if (updateAvailabilityDto.doctorId) {
      const doctor = await this.medecinRepository.findOne(updateAvailabilityDto.doctorId);
      if (!doctor) {
        throw new NotFoundException(`Médecin #${updateAvailabilityDto.doctorId} introuvable.`);
      }
    }

    const overlapping = await this.availabilityRepository.findOverlapping(
      doctorId,
      start,
      end,
      id,
    );

    if (overlapping) {
      throw new ConflictException('Le nouveau créneau chevauche une disponibilité existante.');
    }

    return this.availabilityRepository.update(id, updateAvailabilityDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.availabilityRepository.remove(id);
  }
}
