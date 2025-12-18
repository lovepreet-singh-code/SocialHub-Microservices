import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import postRoutes from './routes/postRoutes';
import { notFoundHandler } from './middleware/notFoundHandler';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/socialhub_post';
mongoose.connect(mongoUri)
    .then(() => console.log('Post Service Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Connect to Redis
import redisClient from './utils/redisClient';
redisClient.connect().catch(err => console.error('Redis Connection Error:', err));

app.use('/posts', postRoutes);

app.get('/', (_req, res) => {
    res.json({ message: 'Post Service API is running' });
});

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Post Service running on port ${PORT}`);
});
