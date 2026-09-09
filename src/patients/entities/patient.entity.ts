import { Appointment, User } from "@prisma/client";

export class Patient {
    constructor(
        public readonly id: number | null,
        public nom: string,
        public dateNaissance: Date,
        public userId: number,
        public readonly createdAt: Date,
        public updatedAt: Date


    ) { }
}
