import express from 'express';
import {
  createProfile,
  getAllProfile,
  updateProfile,
} from '../../controllers/profile.controller';
import { upload } from '../../middlewares/upload-file';
import { authentication } from '../../middlewares/authentication';

const profileRoute = express();

profileRoute.get('/', authentication, getAllProfile);
profileRoute.post(
  '/',
  upload('multiple', '', [
    { name: 'profileImage', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  createProfile,
);
profileRoute.put(
  '/',
  upload('multiple', '', [
    { name: 'profileImage', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  authentication,
  updateProfile,
);

export default profileRoute;
