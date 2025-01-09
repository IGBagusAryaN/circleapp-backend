import express from 'express';
import {
  getAllLike,
  toggleLikeThread,
} from '../../controllers/like.controller';
import { authentication } from '../../middlewares/authentication';

const likeRoute = express();

likeRoute.get('/:id', getAllLike);
likeRoute.post('/:id', authentication, toggleLikeThread);

export default likeRoute;
