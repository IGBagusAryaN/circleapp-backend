import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllUser(req: Request, res: Response) {
  try {
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        username: true,
        profile: {
          select: {
            fullname: true,
            bio: true,
            bannerImage: true,
            profileImage: true,
          },
        },
        followers: true,
        following: true,
      },
    });

    const usersWithFollowCounts = allUsers.map((user) => ({
      ...user,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    }));

    return res.status(200).json(usersWithFollowCounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    const updatedData: any = {};
    if (username) updatedData.username = username;
    if (email) updatedData.email = email;

    if (username || email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: username || undefined },
            { email: email || undefined },
          ],
          NOT: { id: Number(id) },
        },
      });
      if (existingUser) {
        return res.status(400).json({
          message: 'Email or username already in use',
        });
      }
    }
    const updateUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
    });
    res.status(200).json({
      message: 'Update user successfully',
      user: updateUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
}

export const searchUsers = async (req: Request, res: Response) => {
  const { query } = req.query;
  const userId = res.locals.userId;

  if (!query || typeof query !== 'string') {
    return res
      .status(400)
      .json({ message: 'Query parameter is required and must be a string' });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query.trim(),
          mode: 'insensitive',
        },
        id: {
          not: userId,
        },
      },
      select: {
        id: true,
        username: true,
        profile: {
          select: {
            fullname: true,
            profileImage: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  console.log('Params:', req.params);

  const { id } = req.params;

  try {
    const userId = parseInt(id, 10);
    // console.log('User ID:', userId);

    if (isNaN(userId)) {
      // console.log('User ID invalid');
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profile: {
          select: {
            fullname: true,
            bio: true,
            bannerImage: true,
            profileImage: true,
          },
        },
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user', error });
  }
};
