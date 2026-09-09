import { Role } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {


    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

   
}
