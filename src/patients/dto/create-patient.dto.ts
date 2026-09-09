import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreatePatientDto {
    @IsNotEmpty()
    @IsString()
    nom: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    dateNaissance: Date;
}

