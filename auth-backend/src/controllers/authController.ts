import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import { IRegisterRequest, ILoginRequest, IAuthResponse, IApiResponse } from '../types';

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
