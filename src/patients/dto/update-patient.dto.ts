import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateNaissance?: Date;
}
