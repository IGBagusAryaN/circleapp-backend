import express from 'express';
import userRoute from '../v1/users.route';
import authRoute from '../v1/auth.route';
import threadRoute from '../v1/thread.route';
import followRoute from '../v1/follow.route';
import likeRoute from '../v1/like.route';
import replyRouter from '../v1/reply.route';
import path from 'path';
import profileRoute from '../v1/profile.route';
import suggestRouter from '../v1/suggest.route';
import searchRoute from '../v1/search.route';

const router = express();

router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/thread', threadRoute);
router.use('/follow', followRoute);
router.use('/like', likeRoute);
router.use('/reply', replyRouter);
router.use('/profile', profileRoute);
router.use('/suggest', suggestRouter);
router.use('/search', searchRoute);
// router.use('/uploads', express.static(path.join(__dirname, '../../middlewares/uploads')));

export default router;
