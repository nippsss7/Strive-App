import express, { Router } from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, validate } from '../controllers/user.control.js';
import upload from '../middlewares/multer.js';
import { clerkAuth } from '../middlewares/clerkAuth.js';
import { ensureUserProfile } from '../controllers/user.control.js';

const router = express.Router();

// router.route('/register').post(register);
router.route('/login').get(clerkAuth, login);
// router.route('/auth').get(ensureUserProfile);
router.route('/logout').get(logout);
router.route('/profile/edit').post(clerkAuth, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(clerkAuth, getSuggestedUsers);
// router.route('/validate').get(clerkAuth, validate);
// router.route('/:id/profile').get(isAuthenticated, getProfile)
router.route('/:id/profile').get((req, res, next) => {
    console.log(`Fetching profile for user ID: ${req.params.id}`);
    next();
}, clerkAuth, getProfile);

router.route('/followOrUnfollow/:id').post(clerkAuth, followOrUnfollow);

export default router;