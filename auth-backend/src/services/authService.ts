import User from '../models/User';
import generateToken from '../utils/generateToken';
import AppError from '../utils/AppError';
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

        if (user) {
            return {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                token: generateToken(user._id.toString()),
            };
        } else {
            throw new AppError('Invalid user data', 400);
        }
    }

    async login(data: ILoginRequest): Promise<IAuthResponse> {
        const { email, password } = data;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        };
    }
}

export default new AuthService();
