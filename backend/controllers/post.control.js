import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { populate } from 'dotenv';
import { Comment } from '../models/comment.model.js';
import { create } from 'domain';
// import { getAuth } from '@clerk/clerk-sdk-node';

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const userId = req.user._id; // 🧠 from middleware

        console.log("adding new post for the userId - ", userId);

        if (!image) {
            return res.status(401).json({
                message: "upload atleast 1 image",
                success: false
            })
        }

        // if (!authorId) {
        //     return res.status(401).json({
        //         message: "You are not logged in!",
        //         success: false
        //     })
        // }

        // uplaoding image -->
        const optimizedImageBuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 }).toBuffer();

        //buffer to dataUri -->
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        //uploading on cloud -->
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        //creating post --> 
        const post = await Post.create({
            caption: caption,
            image: cloudResponse.secure_url,
            authorId: userId, // ➔ Clerk UserId
            author: userId
            // clerk changes -->
        })

        // pushing post._id into the user's posts array
        const user = await User.findOne({ clerkUserId: userId });
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: "New post added",
            success: true,
            post
        });

    } catch (error) {
        console.log("unable to post content!")
        console.log(error);
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments', sort: { createdAt: -1 },
                populate: { path: 'authorId', select: 'username profilePicture' }
            })
        // console.log("Fetched posts:", JSON.stringify(posts, null, 2));

        return res.status(200).json({
            message: "Fetched all Posts",
            success: true,
            posts
        })


    } catch (error) {
        console.log("unable to fetch all posts!")
        console.log(error);
    }
}

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.user; // 🧠 MongoDB user attached by clerkAuth middleware
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: 'authorId', select: 'username profilePicture' })
            .populate({
                path: 'comments', sort: { createdAt: -1 },
                populate: { path: 'authorId', select: 'username profilePicture' }
            })

        return res.status(200).json({
            message: "Fetched user's Posts",
            success: true,
            posts
        })

    } catch (error) {
        console.log("unable to fetch user's posts")
        console.log(error)
    }
}

export const getUserPostByID = async (req, res) => {
    try {
        const authorId = req.params.id;
        console.log("author id is: ", authorId);
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: 'authorId', select: 'username profilePicture' })
            .populate({
                path: 'comments', sort: { createdAt: -1 },
                populate: { path: 'authorId', select: 'username profilePicture' }
            })

        // console.log("Fetched posts are: ", posts)

        return res.status(200).json({
            message: "Fetched user's Posts",
            success: true,
            posts
        })

    } catch (error) {
        console.log("unable to fetch user's posts")
        console.log(error)
    }
}

export const likePost = async (req, res) => {
    try {
        console.log("like function called")
        const likeKarneWala = req.user._id; // 🛠️ Proper way after Clerk
        const clerkId = req.user.clerkUserId;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(401).json({ message: 'post not found', succes: false });

        // like logic -->
        await post.updateOne({ $addToSet: { likes: likeKarneWala } });
        await post.save();

        return res.status(200).json({ message: "post liked", success: true });

    } catch (error) {
        console.log('unable to like the post!');
        console.log(error)
    }
}

export const dislikePost = async (req, res) => {
    try {
        const dislikeKarneWala = req.user._id; // 🛠️ Proper way after Clerk
        const clerkId = req.user.clerkUserId;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(401).json({ message: 'post not found', succes: false });

        // dislike logic -->
        await post.updateOne({ $pull: { likes: dislikeKarneWala } })
        await post.save();

        return res.status(200).json({ message: "post disliked", success: true });

    } catch (error) {
        console.log('unable to dislike the post!');
        console.log(error)
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKarneWala = req.user._id; // ✅ Correct: Clerk user ID
        const post = await Post.findById(postId);
        const { text } = req.body

        if (!text) return res.status(400).json({ message: "text is required", success: false });

        //creating comment -->
        const comment = await Comment.create({
            text,
            authorId: commentKarneWala,
            post: postId
        });

        // Populating the author field of the newly created comment
        const populatedComment = await Comment.findById(comment._id)
            .populate({ path: 'authorId', select: 'username profilePicture' });

        //pushing comment in the post -->
        post.comments.push(comment._id);
        await post.save();

        return res.status(200).json({ message: "comment added", success: true, populatedComment })

    } catch (error) {
        console.log("unable to add comment!");
        console.log(error);
    }
}

export const getCommentsByPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate('path', 'username profilePicture');

        if (!comments) return res.status(400).json({ message: "No comments on this post", success: false });

        return res.status(200).json({ message: "comments fetched for this post", success: true, comments })

    } catch (error) {
        console.log("unable to fetch comments for this post!");
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.user;

        const post = await Post.findById(postId);
        if (!post) return res.status(200).json({ message: "cannot find post", success: false });

        // check if logged in user is the owner of the post -->
        if (post.author.toString() !== authorId) return res.status(403).json({ message: "Unauthorized", success: false });

        //deleting post -->
        await post.findByIdAndDelete(postId);

        //deleting post from user -->
        let user = await User.findById(authorId);
        user.posts = User.posts.filter(id => id.toString() !== postId);
        await user.save();

        //deleting comments -->
        await Comment.deleteMany({ post: postId });
        return res.status(200).json({ success: true });

    } catch (error) {
        console.log("can not delete the post!")
        console.log(error)
    }
}

export const bookmarkPost = async (res, req) => {
    try {
        const postId = res.params.id;
        const post = await Post.findById(postId);
        const authorId = req.user;
        const user = await User.findById(authorId);
        if (!post) return res.status(200).json({ message: "cannot find post", success: false });

        if (user.bookmarks.includes(post._id)) {
            // remove from bookmark
            await user.updateOne({ $pull: { bookmarks: post._id } })
            await user.save();
            return res.status(200).json({ type: "unsaved", message: "bookmark removed", success: true })
        }
        else {
            // add to bookmark
            await user.updateOne({ $addToSet: { bookmarks: post._id } })
            await user.save();
            return res.status(200).json({ type: "saved", message: "bookmark saved", success: true })
        }

    } catch (error) {
        console.log("unable to bookmark!");
        console.log(error);
    }
}