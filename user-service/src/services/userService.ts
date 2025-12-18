import User from '../models/User';
import AppError from '../utils/AppError';
import cacheService from './cacheService';
import { IUserResponse } from '../types';

class UserService {
    async getUserById(id: string): Promise<IUserResponse> {
        // Try to get from cache first
        const cacheKey = cacheService.getCacheKey('user', id);
        const cachedUser = await cacheService.get<IUserResponse>(cacheKey);

        if (cachedUser) {
            return cachedUser;
        }

        // Cache miss - fetch from database
        const user = await User.findById(id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const userResponse: IUserResponse = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };

        // Store in cache for future requests
        await cacheService.set(cacheKey, userResponse);

        return userResponse;
    }

    async invalidateUserCache(userId: string): Promise<void> {
        const cacheKey = cacheService.getCacheKey('user', userId);
        await cacheService.del(cacheKey);
    }
}

export default new UserService();
