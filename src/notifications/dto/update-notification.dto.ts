import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsInt({ message: "L'userId doit être un nombre entier." })
  userId?: number;

  @IsOptional()
  @IsString({ message: 'Le message doit être une chaîne de caractères.' })
  message?: string;

  @IsOptional()
  @IsBoolean({ message: 'Le champ lu doit être un booléen.' })
  lu?: boolean;
}
