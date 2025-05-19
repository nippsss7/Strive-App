import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
import getDataUri from "../utils/dataUri.js";
import { Post } from "../models/post.model.js";
import sharp from 'sharp';
import getDataUriDP from "../utils/dataUriDP.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
// import { ClerkExpressRequireAuth } from "@clerk/express";

// const requireAuth = ClerkExpressRequireAuth();

// clerk changes -->
// export const register = async (req, res) => {
//     try {

//         const { username, email, password } = req.body;

//         if (!username || !email || !password) {
//             return res.status(401).json({
//                 message: "Something is missing, Please Check!",
//                 success: false
//             })
//         }

//         let user = await User.findOne({ email: email })
//         // console.log(user)
//         if (user) {
//             return res.status(401).json({
//                 message: "User already exists!",
//                 success: false
//             })
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         await User.create({
//             username,
//             email,
//             password: hashedPassword
//         })
//         return res.status(201).json({
//             message: "Account created succesfully!",
//             success: true
//         })


//     } catch (error) {
//         console.log("error: unable to register!")
//         console.log(error)
//     }
// }

// export const login = async (req, res) => {
//     try {

//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(401).json({
//                 message: "Something is missing, Please Check!",
//                 success: false
//             })
//         }

//         let user = await User.findOne({ email: email })
//         if (!user) {
//             return res.status(401).json({
//                 message: "Invalid email address!",
//                 success: false
//             })
//         }

//         const isPasswordMatch = await bcrypt.compare(password, user.password)
//         if (!isPasswordMatch) {
//             return res.status(401).json({
//                 message: "Invalid Password!",
//                 success: false
//             })
//         }

//         const token = await jwt.sign({ userid: user._id }, process.env.KEY_SECRET, { expiresIn: '1d' });

//         //populating Posts with user -->
//         const populatedPosts = await Promise.all(
//             user.posts.map(async (postId) => {
//                 const post = await Post.findById(postId);
//                 if (post.author.equals(user._id)) {
//                     return post;
//                 }
//                 return null;
//             })
//         )

//         user = {
//             _id: user.id,
//             username: user.username,
//             email: user.email,
//             profilePicture: user.profilePicture,
//             bio: user.bio,
//             followers: user.followers,
//             following: user.following,
//             posts: populatedPosts
//         }

//         return res.cookie("token", token, { 
//             httpOnly: true,  
//             sameSite: "None",  
//             secure: true, // ✅ Ensures cookies work on HTTPS
//             maxAge: 24 * 60 * 60 * 1000  // ✅ 1 day expiration
//         }).json({
//             message: `Welcome ${user.username}`,
//             success: true,
//             user
//         });


//     } catch (error) {
//         console.log("unable to login!");
//         console.log(error)

//     }
// }

export const login = async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            user,
            success: true
        })

    } catch (error) {
        console.log("unable to store user in redux through clerk")
        console.log(error)
    }

}


export async function ensureUserProfile() {
    console.log("called ensureUserProfile")
    const user = await currentUser(); // gets the Clerk user
    const userId = user.id;

    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
        profile = await User.create({
            userId,
            username: user.username || user.firstName,
            avatar: user.imageUrl,
        });
    }

    return profile;
}


export const logout = async (_, res) => {
    try {

        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out Successfully',
            success: true
        })

    } catch (error) {
        console.log("Unable to logout!")
        console.log(error)
    }
}

export const validate = async (req, res) => {
    console.log("validate function called")
}

export const getProfile = async (req, res) => {
    console.log("get profile is called")
    try {
        const userId = req.params.id;

        let user = await User.findById(userId).select("-password");
        return res.status(200).json({
            user,
            success: true
        })

    } catch (error) {
        console.log("error in fetching data!")
        console.log(error)
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.user;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        // console.log(profilePicture);

        if (profilePicture) {
            const resizedDP = await sharp(profilePicture.buffer)
                .resize(200, 200)
                .toBuffer();

            // console.log(resizedDP);

            // console.log("Resized Image Buffer:", resizedDP); 

            const fileUri = getDataUriDP(resizedDP, profilePicture.originalname);

            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: 'user not found',
                success: false
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'profile updated',
            success: true,
            user
        });

    } catch (error) {
        console.log("unable to edit!");
        console.log(error);
        res.status(500).json({ message: "An error occurred", success: false });
    }
};


export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "currently do not have any users",
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })

    } catch (error) {
        console.log("cant suggest users")
        console.log(error)
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;

        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: "you cant follow/unfollow yourself",
                success: false
            })
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "user not found",
                success: false
            })
        }

        // check to follow or unfollow -->
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } })
            ])
            return res.status(200).json({ message: "Unfollowed Succesfully", success: true });
        }
        else {
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } })
            ])
            return res.status(200).json({ message: "Followed Succesfully", success: true });
        }

    } catch (error) {
        console.log("not able to know follow or unfollow");
        console.log(error);
    }
}