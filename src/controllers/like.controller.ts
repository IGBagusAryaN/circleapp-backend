import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function getAllLike(req: Request, res: Response) {
  const threadId = parseInt(req.params.id);

  if (isNaN(threadId)) {
    return res.status(400).json({ message: 'Invalid thread ID' });
  }

  try {
    const likes = await prisma.like.findMany({
      where: { threadId, isDeleted: 0 },
      include: { user: true },
    });

    const totalLikes = likes.length;
    const likedUsers = likes.map((like) => ({
      id: like.user.id,
      username: like.user.username,
    }));

    res.status(200).json({ totalLikes, likedUsers });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ message: 'Error fetching likes', error });
  }
}
export async function toggleLikeThread(req: Request, res: Response) {
  const threadId = parseInt(req.params.id);
  const userId = (req as any)?.user?.id;

  if (isNaN(threadId)) {
    return res.status(400).json({ message: 'Invalid thread ID' });
  }

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const existingThread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        author: true,
      },
    });

    if (!existingThread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    const threadOwnerId = existingThread.authorId;

    // Ambil data user yang sedang nge-like termasuk profile-nya
    const liker = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }, // pastikan ada relasi profile di schema
    });

    if (!liker || !liker.profile) {
      return res.status(404).json({ message: 'Liker profile not found' });
    }

    const existingLike = await prisma.like.findFirst({
      where: { userId, threadId },
    });

    const io = req.app.get('io');
    let isLikedNow = true;

    if (existingLike) {
      const isUnliking = existingLike.isDeleted === 0;
      isLikedNow = !isUnliking;

      await prisma.like.update({
        where: { id: existingLike.id },
        data: {
          isDeleted: isUnliking ? 1 : 0,
          deletedAt: isUnliking ? new Date() : null,
        },
      });

      // Emit hapus notifikasi jika sedang unlike
      if (isUnliking && io && threadOwnerId !== userId) {
        const removePayload = {
          type: 'like',
          threadId,
          fromUserId: userId,
        };
        io.to(`user-${threadOwnerId}`).emit('removeNotification', removePayload);
      }
    } else {
      await prisma.like.create({
        data: {
          userId,
          threadId,
          isDeleted: 0,
        },
      });
      isLikedNow = true;
    }

    const likes = await prisma.like.findMany({
      where: { threadId, isDeleted: 0 },
      include: { user: true },
    });

    const totalLikes = likes.length;
    const likedUsers = likes.map((like) => ({
      id: like.user.id,
      username: like.user.username,
    }));

    // Emit notifikasi LIKE baru
    if (io && threadOwnerId !== userId && isLikedNow) {
      const payload = {
        id: Date.now(), // atau pakai uuid
        type: 'like',
        message: 'like your post!',
        threadId,
        username: liker.username, // dari user
        avatarUrl: liker.profile[0].profileImage ?? '', // dari profile
      };

      console.log('🚀 Emit newNotification:', payload);
      io.to(`user-${threadOwnerId}`).emit('newNotification', payload);
    }

    return res.status(200).json({
      message: 'Toggle like successfully',
      totalLikes,
      likedUsers,
    });
  } catch (error) {
    console.error('Error toggling like thread:', error);
    return res.status(500).json({
      message: 'Error toggling like thread',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

