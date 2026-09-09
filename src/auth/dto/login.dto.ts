import { IsEmail, IsNotEmpty, IsString, IsEnum } from "class-validator";
import { Role } from "@prisma/client";


export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;


}
