import { PrismaService } from "src/prisma/prisma.service";
import { UserRepositoy } from "./user.repository";
import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { Prisma } from '@prisma/client';




@Injectable()
export class PrismaUserRepository implements UserRepositoy {
    constructor(private readonly prisma: PrismaService) { }
    async create(user: User, tx?: Prisma.TransactionClient): Promise<User> {
        const client = tx ?? this.prisma;
        const createdUser = await client.user.create({
            data: {
                email: user.email,
                password: user.password,
                role: user.role,
            }
        })
        return new User(createdUser.id, createdUser.email, createdUser.password, createdUser.role, null, null, new Date(), new Date());
    }
    async getAllUsers(): Promise<User[]> {
        const users = await this.prisma.user.findMany()

        return users.map((users) => new User(users.id, users.email, users.password, users.role, null, null, new Date(), new Date()))
    }



    async getOneUser(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id } })
        if (!user) throw new Error("User not found");
        return new User(user.id, user.email, user.password, user.role, null, null, new Date(), new Date());
    }


    async update(id: number, user: User): Promise<User> {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: {
                email: user.email,
                password: user.password,
                role: user.role,
            }
        })
        return new User(updatedUser.id, updatedUser.email, updatedUser.password, updatedUser.role, null, null, new Date(), new Date());
    }


    async remove(id: number): Promise<User> {
        const deletedUser = await this.prisma.user.delete({ where: { id } })
        if (!deletedUser) throw new Error("User not found");
        return new User(deletedUser.id, deletedUser.email, deletedUser.password, deletedUser.role, null, null, new Date(), new Date());
    }


    async getUserByEmail(email: string): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { email } })
        if (!user) throw new Error("User not found");
        return new User(user.id, user.email, user.password, user.role, null, null, new Date(), new Date());
    }

}