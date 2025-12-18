import { Request, Response, NextFunction } from 'express';
import redisClient from '../utils/redisClient';

export const idempotency = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = req.headers['idempotency-key'];

    if (!key) {
        // If no key provided, processing continues normally without idempotency protection
        next();
        return;
    }

    const idempotencyKey = `idempotency:${key}`;

    try {
        const cachedResponse = await redisClient.get(idempotencyKey);

        if (cachedResponse) {
            const { status, body } = JSON.parse(cachedResponse);
            console.log(`[Idempotency] Returning cached response for key: ${key}`);
            res.status(status).json(body);
            return;
        }

        // Hijack res.json to cache the response
        const originalJson = res.json;

        res.json = (body: any): Response => {
            // We only cache successful creation (201) or success (200) to safely retry failures
            if (res.statusCode >= 200 && res.statusCode < 300) {
                redisClient.set(idempotencyKey, JSON.stringify({
                    status: res.statusCode,
                    body
                }), {
                    EX: 60 * 60 * 24 // Cache for 24 hours
                }).catch(err => console.error('Redis Cache Error:', err));
            }

            return originalJson.call(res, body);
        };

        next();
    } catch (error) {
        console.error('Idempotency/Redis Error:', error);
        next(); // Fail open: proceed if Redis is down
    }
};
