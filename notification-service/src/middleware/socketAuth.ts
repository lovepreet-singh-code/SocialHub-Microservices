import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../types';

export const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        const jwtSecret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, jwtSecret) as IJwtPayload;

        // Attach user info to socket
        socket.data.user = {
            id: decoded.id,
            // You can add more info if it's in the token
        };

        next();
    } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error: Invalid token'));
    }
};
