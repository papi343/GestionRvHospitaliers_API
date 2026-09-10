import { IsInt, IsOptional, IsDateString, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FilterAvailabilityDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  doctorId?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  isBooked?: boolean;
}
