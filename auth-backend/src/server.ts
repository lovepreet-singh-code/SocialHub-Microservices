import 'dotenv/config';

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Auth Backend API is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT: number = parseInt(process.env.PORT || '5000', 10);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
