import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from '../types/socket.d';

let io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export const socketIO = {
  init: (httpServer: HttpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: process.env.SOCKET_CORS_ORIGIN ? process.env.SOCKET_CORS_ORIGIN.split(',') : '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    console.log('Socket.IO initialized');
    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error('Socket.IO not initialized!');
    }
    return io;
  },
};
