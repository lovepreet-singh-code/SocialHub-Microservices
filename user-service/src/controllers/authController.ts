import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import {
  IRegisterRequest,
  ILoginRequest,
  IAuthResponse,
  IApiResponse,
  IRefreshTokenRequest,
} from '../types';
import { rabbitMQ } from '../utils/rabbitMQ';

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
export const register = async (
  req: Request<object, object, IRegisterRequest>,
  res: Response<IApiResponse<IAuthResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.register(req.body);

    // Publish event
    await rabbitMQ.publish('user.created', {
      id: result._id,
      name: result.name,
      email: result.email,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
export const login = async (
  req: Request<object, object, ILoginRequest>,
  res: Response<IApiResponse<IAuthResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.login(req.body);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /auth/refresh
// @access  Public
export const refresh = async (
  req: Request<object, object, IRefreshTokenRequest>,
  res: Response<IApiResponse<{ token: string; refreshToken: string }>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /auth/logout
// @access  Private
export const logout = async (
  req: Request<object, object, IRefreshTokenRequest>,
  res: Response<IApiResponse<null>>,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    if (!refreshToken) {
      res.status(400).json({
        success: false,

        message: 'Refresh token is required',
      });
      return;
    }

    await authService.logout(req.user._id, refreshToken);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
