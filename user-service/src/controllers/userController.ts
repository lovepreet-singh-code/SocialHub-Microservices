/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';
import uploadService from '../services/uploadService';
import User from '../models/User';
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

// @desc    Upload user avatar
// @route   POST /users/upload-avatar
// @access  Private
export const uploadAvatar = async (
  req: Request,
  res: Response<IApiResponse<{ avatar: string }>>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Delete old avatar if exists
    if (user.avatarPublicId) {
      await uploadService.deleteImage(user.avatarPublicId);
    }

    // Upload new avatar
    const result = await uploadService.uploadImage(req.file.buffer, 'avatars');

    // Update user with new avatar
    user.avatar = result.url;
    user.avatarPublicId = result.publicId;
    await user.save();

    // Invalidate user cache
    await userService.invalidateUserCache(user._id.toString());

    res.json({
      success: true,
      data: {
        avatar: result.url,
      },
      message: 'Avatar uploaded successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user avatar
// @route   DELETE /users/avatar
// @access  Private
export const deleteAvatar = async (
  req: Request,
  res: Response<IApiResponse<null>>,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
      return;
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Delete avatar from Cloudinary if exists
    if (user.avatarPublicId) {
      await uploadService.deleteImage(user.avatarPublicId);
    }

    // Remove avatar from user
    user.avatar = '';
    user.avatarPublicId = '';
    await user.save();

    // Invalidate user cache
    await userService.invalidateUserCache(user._id.toString());

    res.json({
      success: true,
      message: 'Avatar deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
