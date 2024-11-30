import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { NotificationService } from './modules/notifications/notification.service';
import { db } from '@campusconnect/db';
import cors from 'cors';

dotenv.config();

const app: Express = express();
app.use(cors());
const port = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.APP_URL,
        methods: ['GET', 'POST'],
    },
});

const notificationService = new NotificationService(io);

io.on('connection', (socket) => {
    notificationService.handleConnection(socket);
});

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/api/notifications/:id', async (req: Request, res: Response) => {
    const id = req.params.id;

    const notifications = await db
        .selectFrom('userNotifications')
        .innerJoin(
            'notifications',
            'notifications.id',
            'userNotifications.notificationId'
        )
        .select([
            'notifications.id',
            'notifications.createdAt',
            'notifications.type',
            'notifications.message',
            'userNotifications.read',
        ])
        .where('userNotifications.userId', '=', Number(id))
        .execute();

    res.json(notifications);
});

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
