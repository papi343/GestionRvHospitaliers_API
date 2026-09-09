import { Injectable } from '@nestjs/common';
import { UserRepositoy } from 'src/users/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register.dto';
import { User } from 'src/users/entities/user.entity';
import { Role } from '@prisma/client'
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatientRepository } from 'src/patients/repositories/patient.repository';
import { Patient } from 'src/patients/entities/patient.entity';
@Injectable()
export class AuthService {
    constructor(
        private readonly userRespository: UserRepositoy,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly patientRespository: PatientRepository,
    ) { }

    async register(registerUserDto: RegisterUserDto) {
        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
        const user = new User(
            null,
            registerUserDto.email,
            hashedPassword,
            Role.PATIENT,
            null,
            null,
            new Date(),
            new Date()
        )
        return this.prisma.$transaction(async (tx) => {
            const createdUser = await this.userRespository.create(
                user,
                tx,
            )
            const patient = await this.patientRespository.create(new Patient(null, registerUserDto.nom, registerUserDto.dateNaissance, createdUser.id!, new Date(), new Date()), tx)
            return { createdUser, patient }

        });

    }


    async login(login: LoginDto): Promise<string> {
        const user = await this.userRespository.getUserByEmail(login.email);
        if (!user) throw new Error("User not found");
        const isPasswordValid = await bcrypt.compare(login.password, user.password);
        if (!isPasswordValid) throw new Error("Invalid password");
        const token = await this.jwtService.signAsync({ sub: user.id, role: user.role });
        return token;
    }


}
