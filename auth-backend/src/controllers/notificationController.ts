import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notificationService';
import AppError from '../utils/AppError';

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await notificationService.getUserNotifications(userId, page, limit);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id;
        const count = await notificationService.getUnreadCount(userId);

        res.status(200).json({
            success: true,
            data: { count }
        });
    } catch (error) {
        next(error);
    }
};

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id;
        const { id } = req.params;

        const notification = await notificationService.markAsRead(userId, id);

        if (!notification) {
            return next(new AppError('Notification not found', 404));
        }

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

export const markAllRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id;
        await notificationService.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id;
        const { id } = req.params;

        const notification = await notificationService.deleteNotification(userId, id);

        if (!notification) {
            return next(new AppError('Notification not found', 404));
        }

        res.status(200).json({
            success: true,
            data: null
        });
    } catch (error) {
        next(error);
    }
};
