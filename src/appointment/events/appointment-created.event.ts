import { AppointmentWithRelations } from "../repositories/appointment.repository";



export class AppointmentCreatedEvent {
    constructor(
        public readonly appointment: AppointmentWithRelations,
    ) { }
}