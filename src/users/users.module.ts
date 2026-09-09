import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { UserRepositoy } from './repositories/user.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaUserRepository
    , { provide: UserRepositoy, useExisting: PrismaUserRepository }
  ],
  exports: [UserRepositoy, UsersService]
})
export class UsersModule { }
