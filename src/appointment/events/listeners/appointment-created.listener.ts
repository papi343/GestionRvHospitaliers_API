import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppointmentCreatedEvent } from '../appointment-created.event';
import { NotificationsService } from '../../../notifications/notifications.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { Mail } from 'nodemailer';
import { NotificationGateway } from 'src/websocket/notification-gateway';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AppointmentCreatedListener {
    private readonly logger = new Logger(AppointmentCreatedListener.name);

    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
        private readonly notificationGateway: NotificationGateway
    ) { }

    @OnEvent('appointment.created')
    async handle(event: AppointmentCreatedEvent) {
        const { appointment } = event;
        this.logger.log(`Handling appointment.created event for appointment #${appointment.id}`);

        try {
            // Find patient's userId
            const patient = await this.prisma.patient.findUnique({
                where: { id: appointment.patientId },
                include: {
                    user: true,
                },
            });

            if (patient) {
                const notification = await this.notificationsService.create({
                    userId: patient.userId,
                    message: `Votre rendez-vous #${appointment.id} a bien été enregistré.`,
                });

                this.mailService.sendMail(patient?.user?.email, 'Rdv enregistré', 'Rdv enregistré')
                this.notificationGateway.sendNotificationToUser(patient.userId, notification);

            }

            // Find doctor's userId
            const doctor = await this.prisma.doctor.findUnique({
                where: { id: appointment.doctorId },
                include: {
                    user: true,
                },
            });

            if (doctor) {
                const notification = await this.notificationsService.create({
                    userId: doctor.userId,
                    message: `Un nouveau rendez-vous #${appointment.id} vous a été attribué.`,
                });
                this.mailService.sendMail(doctor?.user?.email, 'Rdv enregistré', 'Rdv enregistré')
                this.notificationGateway.sendNotificationToUser(doctor.userId, notification);
            }
        } catch (error) {
            this.logger.error(`Error processing appointment.created event: ${error.message}`, error.stack);
        }
    }
}