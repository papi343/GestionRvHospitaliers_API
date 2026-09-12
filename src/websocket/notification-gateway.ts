import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';



@WebSocketGateway({
    core: {
        origin: "*"
    },
})
export class NotificationGateway implements OnGatewayConnection,
    OnGatewayDisconnect {
    constructor(private readonly jwtService: JwtService) {

    }
    @WebSocketServer()
    server: Server;


    handleConnection(client: Socket) {
        const authHeader = client.handshake.auth.token;
        const token = authHeader.split(' ')[1];
        if (!token) {
            client.disconnect();
        }

        try {
            const decodedToken = this.jwtService.verify(token);
            const userId = decodedToken.sub;
            client.rooms.add(`userId_${userId}`);
            console.log(`user ${userId} connected`);
        } catch (error) {
            client.disconnect();
        }

    }

    handleDisconnect(client: Socket) {
        const userId = client.handshake.auth.userId;

        console.log(`user ${userId} disconnected`);
    }


    sendNotificationToUser(userId: number, Notification: any) {
        this.server.to(`userId_${userId}`).emit('notification', Notification);
        console.log(`notification sent to user ${userId}`);
    }
}