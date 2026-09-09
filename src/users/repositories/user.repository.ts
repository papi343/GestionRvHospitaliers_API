
import { Prisma } from '@prisma/client';
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from '../entities/user.entity';




export abstract class UserRepositoy {
    abstract create(user: User, tx?: Prisma.TransactionClient): Promise<User>;
    abstract getAllUsers(): Promise<User[]>;
    abstract getUserByEmail(email: string): Promise<User>;
    abstract getOneUser(id: number): Promise<User>;
    abstract update(id: number, user: User): Promise<User>;
    abstract remove(id: number): Promise<User>;

}