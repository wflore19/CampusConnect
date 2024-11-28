import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { NotificationService } from './modules/notifications/notification.service';

dotenv.config();

const app: Express = express();
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

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
