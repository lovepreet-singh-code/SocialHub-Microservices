import 'dotenv/config';

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import redisClient from './config/redisClient';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import mediaRoutes from './routes/mediaRoutes';
import { notFoundHandler } from './middleware/notFoundHandler';

const app: Application = express();

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

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/media', mediaRoutes);

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'User Service API is running' });
});

// 404 Handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || '5001', 10);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`User Service is running on port ${PORT}`);
  });
}

export { app };
