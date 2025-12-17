export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
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
  _id: string;
  name: string;
  email: string;
  token: string;
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
