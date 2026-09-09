import { IsEmail, IsNotEmpty, IsString, IsEnum, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { Role } from "@prisma/client";

export class RegisterUserDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    // donnees patient
    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    dateNaissance: Date;
}

