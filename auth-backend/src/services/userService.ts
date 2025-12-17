import User from '../models/User';
import AppError from '../utils/AppError';
import { IUserResponse } from '../types';

class UserService {
    async getUserById(id: string): Promise<IUserResponse> {
        const user = await User.findById(id);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };
    }
}

export default new UserService();
