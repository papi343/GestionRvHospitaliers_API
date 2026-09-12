import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaNotificationsRepository } from './repositories/prisma-notifications.repository';
import { NotificationsRepository } from './repositories/notifications.repository';
import { AppointmentCreatedListener } from '../appointment/events/listeners/appointment-created.listener';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    PrismaNotificationsRepository,
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    AppointmentCreatedListener,
  ],
  exports: [NotificationsService, NotificationsRepository],
})
export class NotificationsModule { }
