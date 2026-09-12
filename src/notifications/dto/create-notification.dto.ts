import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty({ message: "L'userId est requis." })
  @IsInt({ message: "L'userId doit être un nombre entier." })
  userId: number;

  @IsNotEmpty({ message: 'Le message est requis.' })
  @IsString({ message: 'Le message doit être une chaîne de caractères.' })
  message: string;
}
