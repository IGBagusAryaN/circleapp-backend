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
const searchRoute = express.Router();
searchRoute.get('/search', authentication, searchUsers);

export default searchRoute;
