export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  refreshTokens?: string[];
  avatar?: string;
  avatarPublicId?: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IJwtPayload {
  id: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface IErrorResponse {
  success: false;
  message: string;
}

export interface INotification {
  _id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}

export interface INotificationResponse {
  notifications: INotification[];
  unreadCount: number;
  page: number;
  totalPages: number;
}

export interface ICreateNotificationRequest {
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  data?: any;
}
