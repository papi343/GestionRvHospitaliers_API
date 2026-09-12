import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { MedecinsModule } from './medecins/medecins.module';
import { AvailabilitiesModule } from './availabilities/availabilities.module';
import { AppointmentModule } from './appointment/appointment.module';
import { MedicalsRecordsModule } from './medicals-records/medicals-records.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailModule } from './mail/mail.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    PatientsModule,
    SpecialtiesModule,
    MedecinsModule,
    AvailabilitiesModule,
    AppointmentModule,
    MedicalsRecordsModule,
    NotificationsModule,
    MailModule,
    WebsocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
