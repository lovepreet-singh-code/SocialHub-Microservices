import { Request, Response } from 'express';
import Post from '../models/Post';
import { rabbitMQ } from '../utils/rabbitMQ';

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, authorId } = req.body;

        const post = await Post.create({ title, content, authorId });

        // Publish event
        await rabbitMQ.publish('post.created', {
            id: post._id,
            title: post.title,
            authorId: post.authorId,
        });

        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

export const getPosts = async (_req: Request, res: Response) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};
