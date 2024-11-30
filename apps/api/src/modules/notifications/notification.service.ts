import { Server, Socket } from 'socket.io';

export class NotificationService {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    // Send notification to a specific user
    sendToUser(
        userId: string,
        notification: { type: string; message: string }
    ) {
        this.io.to(`user:${userId}`).emit('notification', notification);
    }

    // Send notification to all users
    broadcast(notification: { type: string; message: string }) {
        this.io.emit('notification', notification);
    }

    // Handle socket connection
    handleConnection(socket: Socket) {
        const userId = socket.handshake.auth.userId;

        if (userId) {
            // Join user to a room for private notifications
            socket.join(`user:${userId}`);
        }

        // Handle disconnect
        socket.on('disconnect', () => {
            if (userId) {
                socket.leave(`user:${userId}`);
            }
        });
    }
}
