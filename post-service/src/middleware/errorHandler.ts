import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    errors?: Record<string, { message: string }>;
}

const errorHandler = (
    err: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error(err.stack);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        res.status(404).json({
            success: false,
            message: 'Resource not found',
        });
        return;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        res.status(400).json({
            success: false,
            message: 'Duplicate field value entered',
        });
        return;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const mongooseErr = err as MongooseError.ValidationError;
        const message = Object.values(mongooseErr.errors).map((val) => val.message);
        res.status(400).json({
            success: false,
            message: message,
        });
        return;
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
    });
};

export default errorHandler;
