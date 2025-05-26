import express from 'express'
import upload from '../middlewares/multer.js';
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPosts, getCommentsByPost, getUserPost, getUserPostByID, likePost } from '../controllers/post.control.js';
import { clerkAuth } from '../middlewares/clerkAuth.js';

const router = express.Router();

router.route("/addpost").post(clerkAuth, upload.single('image'), addNewPost);
router.route("/all").get(clerkAuth, getAllPosts);
router.route("/userpost/all").get(getUserPost);
router.route("/:id/like").get(clerkAuth, likePost);
router.route("/:id/dislike").get(clerkAuth, dislikePost);
router.route("/:id/comment").post(clerkAuth, addComment);
router.route("/:id/comment/all").post(clerkAuth, getCommentsByPost);
router.route("/:id/bookmark").post(clerkAuth, bookmarkPost);
router.route("/userpost/:id").get(clerkAuth, getUserPostByID)

export default router;