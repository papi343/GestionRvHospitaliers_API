import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositoy } from './repositories/user.repository';
import { Role } from '@prisma/client'
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(private readonly userRespository: UserRepositoy) { }
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const user = new User(null, createUserDto.email, createUserDto.password, Role.PATIENT, null, null, new Date(), new Date());

    return await this.userRespository.create(user);

  }

  async findAll() {
    return await this.userRespository.getAllUsers();
  }

  async findOne(id: number) {
    return await this.userRespository.getOneUser(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    updateUserDto.password = hashedPassword;
    const user = new User(id, updateUserDto.email, updateUserDto.password, updateUserDto.role, null, null, new Date(), new Date());
    return await this.userRespository.update(id, user);
  }

  async remove(id: number) {
    return await this.userRespository.remove(id);
  }


}
