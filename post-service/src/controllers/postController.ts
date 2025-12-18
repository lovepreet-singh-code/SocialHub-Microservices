import { Request, Response } from 'express';
import Post from '../models/Post';
import { rabbitMQ } from '../utils/rabbitMQ';

export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const authorId = req.user?._id;

        const post = await Post.create({ title, content, authorId });

        // Publish event
        await rabbitMQ.publish('post.created', {
            id: post._id,
            title: post.title,
            authorId: post.authorId,
        });

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

export const getPosts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const total = await Post.countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ success: false, message: 'Post not found' });
            return;
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ success: false, message: 'Post not found' });
            return;
        }

        // Check ownership
        if (post.authorId.toString() !== req.user?._id.toString()) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        post.title = title || post.title;
        post.content = content || post.content;
        await post.save();

        res.status(200).json({ success: true, message: 'Post updated successfully', data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ success: false, message: 'Post not found' });
            return;
        }

        // Check ownership
        if (post.authorId.toString() !== req.user?._id.toString()) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        await post.deleteOne();

        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
};
