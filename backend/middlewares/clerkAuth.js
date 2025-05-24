// middlewares/clerkAuth.js
import { requireAuth } from '@clerk/express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { User } from '../models/user.model.js';

export const clerkAuth = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const { userId } = req.auth;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      let user = await User.findOne({ clerkUserId: userId });

      // add username functionality here - 

      if (!user) {
        const clerkUser = await clerkClient.users.getUser(userId);
        const username = clerkUser.username || clerkUser.firstName || 'user' + Date.now();
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const profilePicture = clerkUser.imageUrl;

        user = await User.create({
          clerkUserId: userId,
          username,
          email,
          profilePicture,
          bio: '',
        });
      }

      req.user = user;
      console.log("clerkAuth:: ", req.user);
      console.log("clerk: ", user)

      next();
    } catch (error) {
      console.error('Clerk Auth Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
];
