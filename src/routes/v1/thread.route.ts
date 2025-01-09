import express from 'express';
import {
  createThread,
  deleteThread,
  getAllThread,
  getThreadDetail,
  updateThread,
} from '../../controllers/thread.controller';
import { authentication } from '../../middlewares/authentication';
import { upload } from '../../middlewares/upload-file';

const threadRoute = express();

threadRoute.get('/', authentication, getAllThread);
threadRoute.get('/:id', authentication, getThreadDetail);
threadRoute.put(
  '/:id',
  authentication,
  upload('single', 'image'),
  updateThread,
);
threadRoute.post('/', authentication, upload('single', 'image'), createThread);
threadRoute.delete('/:id', authentication, deleteThread);

export default threadRoute;
