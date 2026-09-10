import { IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateAvailabilityDto {
  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsDateString()
  @IsNotEmpty()
  start: string;

  @IsDateString()
  @IsNotEmpty()
  end: string;
}
