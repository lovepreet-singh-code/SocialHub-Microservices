import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      _id: string;
      name: string;
      email: string;
    };
  }
}
