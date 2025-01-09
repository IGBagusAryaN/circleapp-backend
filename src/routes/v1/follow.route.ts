import express from 'express';
import {
  checkFollowStatus,
  getAllFollow,
  getFollowers,
  getFollowing,
  toggleFollow,
} from '../../controllers/follow.controller';
import { authentication } from '../../middlewares/authentication';

const followRoute = express();

followRoute.get('/following/:id', authentication, getFollowing);
followRoute.get('/followers/:id', authentication, getFollowers);
followRoute.get('/status/:id', authentication, checkFollowStatus);
followRoute.post('/:id', authentication, toggleFollow);

export default followRoute;
