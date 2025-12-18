import Notification, { INotificationDocument } from '../models/Notification';
import { ICreateNotificationRequest, INotificationResponse } from '../types';
import { socketIO } from '../config/socket';

export const createNotification = async (data: ICreateNotificationRequest): Promise<INotificationDocument> => {
    const notification = await Notification.create(data);

    // Emit real-time notification to the user's room
    try {
        const io = socketIO.getIO();
        io.to(data.userId.toString()).emit('notification', notification);
    } catch (error) {
        console.warn('Socket.IO not initialized or failed to emit notification:', error);
    }

    return notification;
};

export const getUserNotifications = async (
    userId: string,
    page: number = 1,
    limit: number = 10
): Promise<INotificationResponse> => {
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Notification.countDocuments({ userId });
    const unreadCount = await Notification.countDocuments({ userId, read: false });

    return {
        notifications,
        unreadCount,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

export const getUnreadCount = async (userId: string): Promise<number> => {
    return await Notification.countDocuments({ userId, read: false });
};

export const markAsRead = async (userId: string, notificationId: string): Promise<INotificationDocument | null> => {
    return await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
    );
};

export const markAllAsRead = async (userId: string): Promise<void> => {
    await Notification.updateMany(
        { userId, read: false },
        { read: true }
    );
};

export const deleteNotification = async (userId: string, notificationId: string): Promise<INotificationDocument | null> => {
    const result = await Notification.findOneAndDelete({ _id: notificationId, userId });
    return result as unknown as INotificationDocument | null;
};
