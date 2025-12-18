import { Request, Response } from 'express';
import Post from '../models/Post';

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, authorId } = req.body;

        // In a real microservice, we might validate authorId via user-service or trust the token.
        // For now, assuming authorId is passed or extracted from middleware.

        const post = await Post.create({ title, content, authorId });
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};
