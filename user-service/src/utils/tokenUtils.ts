import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: string;
}

export const generateAccessToken = (id: string): string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const expiry = (process.env.JWT_ACCESS_EXPIRY || '15m') as string;

    return jwt.sign({ id }, jwtSecret, { expiresIn: expiry as any });
};

export const generateRefreshToken = (id: string): string => {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtRefreshSecret) {
        throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }

    const expiry = (process.env.JWT_REFRESH_EXPIRY || '7d') as string;

    return jwt.sign({ id }, jwtRefreshSecret, { expiresIn: expiry as any });
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtRefreshSecret) {
        throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }

    return jwt.verify(token, jwtRefreshSecret) as TokenPayload;
};

// Legacy function for backward compatibility
const generateToken = (id: string): string => {
    return generateAccessToken(id);
};

export default generateToken;
