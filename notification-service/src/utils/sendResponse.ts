import { Response } from 'express';

interface IApiResponse<T> {
    success: true;
    data: T;
    message?: string;
}

export const sendResponse = <T>(
    res: Response,
    statusCode: number,
    data: T,
    message?: string
) => {
    const response: IApiResponse<T> = {
        success: true,
        data,
    };

    if (message) {
        response.message = message;
    }

    return res.status(statusCode).json(response);
};
