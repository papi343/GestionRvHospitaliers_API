import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { NotificationGateway } from './notification-gateway';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'dev-secret-key',
            }),
        }),
    ],
    providers: [
        NotificationGateway,
    ],
    exports: [NotificationGateway],
})
export class WebsocketModule { }
