import { Server } from 'socket.io';
import { AuthenticatedSocket, ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from '../types/socket.d';

export const registerSocketHandlers = (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    io.on('connection', (socket: AuthenticatedSocket) => {
        console.log(`User connected: ${socket.user?.name} (${socket.user?.id})`);

        // Automatically join a room based on userId so we can send personal notifications
        if (socket.user?.id) {
            socket.join(socket.user.id);
            console.log(`User ${socket.user.name} joined room: ${socket.user.id}`);
        }

        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`User ${socket.user?.name} joined room: ${room}`);
        });

        socket.on('leave_room', (room) => {
            socket.leave(room);
            console.log(`User ${socket.user?.name} left room: ${room}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user?.name}`);
        });
    });
};
