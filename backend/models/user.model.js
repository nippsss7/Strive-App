import mongoose from "mongoose";

// clerk changes -->
const userSchema = new mongoose.Schema({
    clerkUserId: { type: String, required: true, unique: true }, // <-- Clerk ID
    username: { type: String },
    email: { type: String },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });



export const User = mongoose.model('User', userSchema); 