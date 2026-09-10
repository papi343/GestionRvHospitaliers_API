import {
  IsInt,
  IsNotEmpty,
  IsDateString,
  IsString,
  IsArray,
  IsOptional,
  Min,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBulkAvailabilityDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  doctorId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'startTime doit être au format HH:mm',
  })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'endTime doit être au format HH:mm',
  })
  endTime: string;

  @IsInt()
  @Min(5)
  @Type(() => Number)
  slotDurationMinutes: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  daysOfWeek?: number[]; // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi. Défaut: [1, 2, 3, 4, 5]

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'breakStartTime doit être au format HH:mm',
  })
  breakStartTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'breakEndTime doit être au format HH:mm',
  })
  breakEndTime?: string;
}
