import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { MedecinRepository } from 'src/medecins/repositories/medecin.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRespository: UserRepositoy,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly patientRespository: PatientRepository,
        private readonly medecinRepository: MedecinRepository,
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
            const patient = await this.patientRespository.create(new Patient(null, registerUserDto.nom, new Date(registerUserDto.dateNaissance), createdUser.id!, new Date(), new Date()), tx)
            const token = await this.jwtService.signAsync({ sub: createdUser.id, role: createdUser.role });
            return {
                token,
                access_token: token,
                user: {
                    id: createdUser.id,
                    email: createdUser.email,
                    role: createdUser.role,
                    nom: patient.nom,
                    patientId: patient.id,
                },
                createdUser,
                patient
            }
        });
    }

    async login(login: LoginDto) {
        let user: User;
        try {
            user = await this.userRespository.getUserByEmail(login.email);
        } catch {
            throw new UnauthorizedException("Email ou mot de passe incorrect");
        }
        const isPasswordValid = await bcrypt.compare(login.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException("Email ou mot de passe incorrect");

        const token = await this.jwtService.signAsync({ sub: user.id, role: user.role });

        let patient: Patient | null = null;
        let doctor: any = null;

        if (user.role === Role.PATIENT && user.id) {
            try {
                patient = await this.patientRespository.getPatientByUserId(user.id);
            } catch {
                patient = null;
            }
        } else if (user.role === Role.DOCTOR && user.id) {
            try {
                doctor = await this.medecinRepository.findByUserId(user.id);
            } catch {
                doctor = null;
            }
        }

        return {
            token,
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                nom: patient?.nom ?? doctor?.nom ?? user.email.split('@')[0],
                patientId: patient?.id ?? null,
                doctorId: doctor?.id ?? null,
            },
            patient,
            doctor,
        };
    }
}
