import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepositoy } from 'src/users/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatientRepository } from 'src/patients/repositories/patient.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      getUserByEmail: jest.fn(),
    };
    const mockJwtService = {
      signAsync: jest.fn(),
    };
    const mockPrismaService = {
      $transaction: jest.fn(),
    };
    const mockPatientRepository = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepositoy, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PatientRepository, useValue: mockPatientRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
