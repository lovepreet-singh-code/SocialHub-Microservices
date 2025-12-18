import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils';
import AppError from '../utils/AppError';
import cacheService from './cacheService';
import { IRegisterRequest, ILoginRequest, IAuthResponse } from '../types';

class AuthService {
  async register(data: IRegisterRequest): Promise<IAuthResponse> {
    const { name, email, password } = data;

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new AppError('User already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      throw new AppError('Invalid user data', 400);
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Store refresh token in database
    user.refreshTokens = [refreshToken];
    await user.save();

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: accessToken,
      refreshToken,
    };
  }

  async login(data: ILoginRequest): Promise<IAuthResponse> {
    const { email, password } = data;

    const user = await User.findOne({ email }).select('+password +refreshTokens');

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Add new refresh token to user's tokens
    if (!user.refreshTokens) {
      user.refreshTokens = [];
    }
    user.refreshTokens.push(refreshToken);
    await user.save();

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const decoded = verifyRefreshToken(token);

      const user = await User.findById(decoded.id).select('+refreshTokens');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check if refresh token exists in user's tokens
      if (!user.refreshTokens || !user.refreshTokens.includes(token)) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken(user._id.toString());
      const newRefreshToken = generateRefreshToken(user._id.toString());

      // Replace old refresh token with new one
      user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
      user.refreshTokens.push(newRefreshToken);
      await user.save();

      return {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const user = await User.findById(userId).select('+refreshTokens');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Remove the refresh token from user's tokens
    if (user.refreshTokens) {
      user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
      await user.save();
    }

    // Invalidate user cache
    const cacheKey = cacheService.getCacheKey('user', userId);
    await cacheService.del(cacheKey);
  }
}

export default new AuthService();
