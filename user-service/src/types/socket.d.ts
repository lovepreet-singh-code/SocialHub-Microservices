import { Socket } from 'socket.io';

export interface ServerToClientEvents {
  notification: (data: any) => void;
  error: (error: { message: string }) => void;
}

export interface ClientToServerEvents {
  join_room: (room: string) => void;
  leave_room: (room: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AuthenticatedSocket extends Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {
  user?: SocketData['user'];
}
