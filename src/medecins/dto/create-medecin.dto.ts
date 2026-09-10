import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateMedecinDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsNotEmpty()
  @IsString()
  licence: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  specialtyIds?: number[];

  @IsNotEmpty()
  @IsString()
  password: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email
}
