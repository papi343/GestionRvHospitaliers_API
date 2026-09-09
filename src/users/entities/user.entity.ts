
import { Doctor, Patient, Role } from "@prisma/client";

export class User {
    constructor(
        public readonly id: number | null,

        public email: string,
        public readonly password: string,
        public role: Role,
        public patient: Patient | null,
        public doctor: Doctor | null,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }

}
