import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class UpdateAvailabilityDto {
  @IsOptional()
  @IsInt()
  doctorId?: number;

  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;
}
