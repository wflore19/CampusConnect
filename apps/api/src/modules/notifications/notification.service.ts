import { db } from '@campusconnect/db';
import { Server, Socket } from 'socket.io';

export class NotificationService {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
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

        socket.on('friend-request', async (data) => {
            console.log(data);
            // this.io.to(`user:${data.userId}`).emit('notification', data);

            const friendRequest = await db
                .insertInto('userFriend')
                .values({
                    uid1: data.fromId,
                    uid2: data.toId,
                    status: 'REQ_UID1',
                })
                .executeTakeFirst();
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            if (userId) {
                socket.leave(`user:${userId}`);
            }
        });
    }
}
