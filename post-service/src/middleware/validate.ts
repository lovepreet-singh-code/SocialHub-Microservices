import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import AppError from '../utils/AppError';

export const validate = (schema: ZodTypeAny) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const message = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
            return next(new AppError(message, 400));
        }
        next(error);
    }
};
