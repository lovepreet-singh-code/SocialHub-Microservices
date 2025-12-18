import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import connectDB from './config/db';
import redisClient from './config/redisClient';
import errorHandler from './middleware/errorHandler';
import notificationRoutes from './routes/notificationRoutes';
import { socketIO } from './config/socket';
import { socketAuth } from './middleware/socketAuth';
import { registerSocketHandlers } from './sockets/socketHandlers';

const app: Application = express();
const httpServer = createServer(app);

// Connect to MongoDB
connectDB();

// Connect to Redis
redisClient.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Socket.IO
const io = socketIO.init(httpServer);
io.use(socketAuth);
registerSocketHandlers(io);

// Initialize RabbitMQ Consumer
import { notificationBus } from './utils/notificationBus';
import * as notificationService from './services/notificationService';

notificationBus.listen(async (payload, routingKey) => {
    if (routingKey === 'user.created') {
        await notificationService.createNotification({
            userId: payload.id,
            type: 'success',
            title: 'Welcome!',
            message: `Hi ${payload.name}, welcome to SocialHub!`,
        });
    } else if (routingKey === 'post.created') {
        await notificationService.createNotification({
            userId: payload.authorId,
            type: 'info',
            title: 'Post Created',
            message: `Your post "${payload.title}" has been published.`,
        });
    }
}).catch(err => console.error('Failed to start notification consumer:', err));

// Routes
app.use('/notifications', notificationRoutes);

// Health check route
app.get('/', (_req: Request, res: Response) => {
    res.json({ message: 'Notification Service API is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || '5003', 10);

httpServer.listen(PORT, () => {
    console.log(`Notification Service is running on port ${PORT}`);
});
