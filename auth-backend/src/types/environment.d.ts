declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
      JWT_ACCESS_EXPIRY?: string;
      JWT_REFRESH_EXPIRY?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
    }
  }
}

export { };
