import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  getAllUser,
  getUserById,
  searchUsers,
  updateUser,
} from '../../controllers/user.controller';
import { authentication } from '../../middlewares/authentication';

const prisma = new PrismaClient();
const userRoute = express.Router();

userRoute.get('/', authentication, getAllUser);
userRoute.put('/:id', updateUser);
userRoute.get('/:id', getUserById);
userRoute.get('/search', authentication, searchUsers);

export default userRoute;
