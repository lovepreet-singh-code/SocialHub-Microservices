/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';
import { IUserResponse, IApiResponse } from '../types';

// @desc    Get current user profile
// @route   GET /users/me
// @access  Private
export const getMe = async (
  req: Request,
  res: Response<IApiResponse<IUserResponse>>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      // Should be handled by auth middleware usually, but separate check here
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await userService.getUserById(req.user._id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
