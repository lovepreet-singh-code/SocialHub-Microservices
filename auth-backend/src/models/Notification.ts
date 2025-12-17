import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '../types';

export interface INotificationDocument extends Omit<INotification, '_id'>, Document { }

const NotificationSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error'],
        default: 'info'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: Schema.Types.Mixed
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d' // Automatically delete notifications after 30 days
    }
});

export default mongoose.model<INotificationDocument>('Notification', NotificationSchema);
