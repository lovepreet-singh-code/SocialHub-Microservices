// Augment Express Request interface to include user property
declare namespace Express {
  export interface Request {
    user?: {
      _id: string;
      name: string;
      email: string;
    };
  }
}
