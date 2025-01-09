import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllFollow(req: Request, res: Response) {
  try {
    const allFollow = await prisma.follow.findMany();
    res.status(200).json(allFollow);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching follows', error });
  }
}

export async function toggleFollow(req: Request, res: Response) {
  const followerId = parseInt(req.params.id); // id user yang mau di-follow
  const { id: followingId } = (req as any).user; // id user yang login

  try {
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
    } else {
      await prisma.follow.create({
        data: {
          followerId,
          followingId,
        },
      });
    }

    const followersCount = await prisma.follow.count({
      where: { followingId },
    });
    const followingCount = await prisma.follow.count({
      where: { followerId: followingId },
    });

    return res.status(200).json({
      message: existingFollow
        ? 'Unfollowed successfully'
        : 'Followed successfully',
      followersCount,
      followingCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling follow status', error });
  }
}

export async function checkFollowStatus(req: Request, res: Response) {
  const followerId = parseInt(req.params.id);
  const { id: followingId } = (req as any).user;

  try {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.status(200).json({ isFollowing: !!follow });
  } catch (error) {
    res.status(500).json({ message: 'Error checking follow status', error });
  }
}
export async function getFollowing(req: Request, res: Response) {
  const userId = (req as any).user.id;

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: true, // ambil data user yang difollow
      },
    });

    res.status(200).json(following);
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ message: 'Error fetching following' });
  }
}

export async function getFollowers(req: Request, res: Response) {
  const userId = (req as any).user.id;

  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: true, // ambil data user yang memfollow
      },
    });

    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching followers' });
  }
}
