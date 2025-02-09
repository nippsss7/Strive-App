import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPosts, getCommentsByPost, getUserPost, getUserPostByID, likePost } from '../controllers/post.control.js';

const router = express.Router();

router.route("/addpost").post(isAuthenticated, upload.single('image'), addNewPost);
router.route("/all").get(isAuthenticated, getAllPosts);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/userpost/:id").get(isAuthenticated, getUserPostByID)
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").post(isAuthenticated, getCommentsByPost);
router.route("/:id/bookmark").post(isAuthenticated, bookmarkPost);

export default router;