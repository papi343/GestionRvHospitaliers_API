import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationGateway } from './notification-gateway';

@Module({
    providers: [
        NotificationGateway,
    ],
    exports: [NotificationGateway],
})
export class WebsocketModule { }
