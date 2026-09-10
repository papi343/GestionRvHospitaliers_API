import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMedicalsRecordDto {
  @IsNotEmpty({ message: "L'id du rendez-vous est obligatoire." })
  @Type(() => Number)
  @IsInt({ message: "L'id du rendez-vous doit être un nombre entier." })
  appointmentId: number;

  @IsNotEmpty({ message: 'Le diagnostic est obligatoire.' })
  @IsString({ message: 'Le diagnostic doit être une chaîne de caractères.' })
  diagnostic: string;
}
