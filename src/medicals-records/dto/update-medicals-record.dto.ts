import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMedicalsRecordDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: "L'id du rendez-vous doit être un nombre entier." })
  appointmentId?: number;

  @IsOptional()
  @IsString({ message: 'Le diagnostic doit être une chaîne de caractères.' })
  diagnostic?: string;
}
