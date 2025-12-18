import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types/socket.d';

let io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const socketIO = {
    init: (httpServer: HttpServer) => {
        // Create Redis Clients for Adapter
        const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
        const subClient = pubClient.duplicate();

        Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
            console.log('Redis Adapter Clients Connected');
        }).catch(err => {
            console.error('Redis Adapter Connection Error:', err);
        });

        io = new Server(httpServer, {
            adapter: createAdapter(pubClient, subClient),
            cors: {
                origin: process.env.SOCKET_CORS_ORIGIN ? process.env.SOCKET_CORS_ORIGIN.split(',') : '*',
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        console.log('Socket.IO initialized with Redis Adapter');
        return io;
    },

    getIO: () => {
        if (!io) {
            throw new Error('Socket.IO not initialized!');
        }
        return io;
    }
};
