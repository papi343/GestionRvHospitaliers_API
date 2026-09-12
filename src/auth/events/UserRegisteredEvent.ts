import { User } from "@prisma/client";




export class UserRegisteredEvent {
    constructor(private readonly user: User) { }
}
