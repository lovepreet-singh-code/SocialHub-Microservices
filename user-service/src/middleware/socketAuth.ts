import { ExtendedError } from 'socket.io/dist/namespace';
import jwt from 'jsonwebtoken';
import { AuthenticatedSocket } from '../types/socket.d';
import { IJwtPayload } from '../types';
import User from '../models/User';

export const socketAuth = async (socket: AuthenticatedSocket, next: (err?: ExtendedError) => void) => {
    try {
        const token =
            socket.handshake.auth.token ||
            socket.handshake.headers.authorization?.split(' ')[1] ||
            socket.handshake.query.token;

        if (!token) {
            return next(new Error('Authentication error: Token is required'));
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return next(new Error('Server configuration error'));
        }

        const decoded = jwt.verify(token as string, jwtSecret) as IJwtPayload;

        const user = await User.findById(decoded.id).select('name email');

        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }

        socket.user = {
            id: user._id.toString(),
            email: user.email,
            name: user.name
        };

        next();
    } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication error: Invalid token'));
    }
};
