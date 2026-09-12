import { IsArray, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateMedecinDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  licence?: string;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  specialtyIds?: number[];

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
}
