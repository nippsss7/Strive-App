import express, { Router } from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register, validate } from '../controllers/user.control.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/validate').get(isAuthenticated, validate);
// router.route('/:id/profile').get(isAuthenticated, getProfile)
router.route('/:id/profile').get((req, res, next) => {
    console.log(`Fetching profile for user ID: ${req.params.id}`);
    next();
}, isAuthenticated, getProfile);

router.route('/followOrUnfollow/:id').post(isAuthenticated, followOrUnfollow);

export default router;