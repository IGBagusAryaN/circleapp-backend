import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getAllThread(req: Request, res: Response) {
  try {
    const filterByUser = req.query.filterByUser === 'true';
    const userId = req.query.userId
      ? parseInt(req.query.userId as string, 10)
      : null;

    if (filterByUser && userId && isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid userId provided' });
    }

    const threads = await prisma.thread.findMany({
      where: {
        isDeleted: 0,
        ...(filterByUser && userId && { authorId: userId }),
      },
      include: {
        profile: { select: { id: true, fullname: true, profileImage: true } },
        author: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ message: 'Get threads successfully', threads });
  } catch (error) {
    console.error('Error fetching threads:', error);
    res.status(500).json({ message: 'Error fetching threads', error });
  }
}

export async function createThread(req: Request, res: Response) {
  const { content } = req.body;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res
      .status(400)
      .json({ message: 'Content must be a non-empty string' });
  }

  try {
    const { id: authorId } = (req as any).user;

    const user = await prisma.user.findUnique({
      where: { id: authorId },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = user.profile && user.profile[0];
    if (!profile) {
      return res.status(400).json({ message: 'User does not have a profile' });
    }

    const file = req.file?.path || null;

    const newThread = await prisma.thread.create({
      data: {
        content,
        authorId,
        profileId: profile.id,
        image: file,
      },
    });

    const threadWithDetails = await prisma.thread.findUnique({
      where: { id: newThread.id },
      include: {
        author: true,
        profile: true,
      },
    });

    return res.status(201).json({
      message: 'Thread created successfully',
      thread: threadWithDetails,
    });
  } catch (error) {
    console.error('Error creating thread:', error);
    return res.status(500).json({ message: 'Error creating thread', error });
  }
}

export async function updateThread(req: Request, res: Response) {
  const threadId = parseInt(req.params.id);
  const { content } = req.body;
  const file = req.file?.path;

  if (!content && !file) {
    return res.status(400).json({ message: 'Nothing to update' });
  }

  try {
    const existingThread = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!existingThread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    if (existingThread.authorId !== (req as any).user.id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to update this thread' });
    }

    const updatedThread = await prisma.thread.update({
      where: { id: threadId },
      data: {
        ...(content && { content }),
        ...(file && { image: file }),
      },
      include: {
        profile: true, // Tambahkan profil
        author: true, // Tambahkan penulis
      },
    });

    res
      .status(200)
      .json({ message: 'Successfully updated thread', thread: updatedThread });
  } catch (error) {
    console.error('Error updating thread:', error);
    res.status(500).json({ message: 'Failed to update thread', error });
  }
}

export async function deleteThread(req: Request, res: Response) {
  const threadId = parseInt(req.params.id);

  try {
    const threadExist = await prisma.thread.findUnique({
      where: { id: threadId },
    });

    if (!threadExist) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    if (threadExist.authorId !== (req as any).user.id) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this thread' });
    }

    if (threadExist.isDeleted === 1) {
      return res.status(400).json({ message: 'Thread is already deleted' });
    }

    await prisma.thread.update({
      where: { id: threadId },
      data: { isDeleted: 1 },
    });

    res.status(200).json({ message: 'Thread deleted successfully' });
  } catch (error) {
    console.error('Error deleting thread:', error);
    res.status(500).json({ message: 'Error deleting thread', error });
  }
}

export async function getThreadDetail(req: Request, res: Response) {
  const threadId = parseInt(req.params.id);

  if (isNaN(threadId)) {
    return res.status(400).json({ message: 'Invalid thread ID' });
  }

  try {
    const thread = await prisma.thread.findUnique({
      where: { id: threadId, isDeleted: 0 },
      include: {
        profile: { select: { id: true, fullname: true, profileImage: true } },
        author: { select: { id: true, username: true } },
      },
    });

    if (!thread) {
      return res.status(404).json({ message: 'Thread not found' });
    }

    res.status(200).json({ message: 'Get thread detail successfully', thread });
  } catch (error) {
    console.error('Error fetching thread detail:', error);
    res.status(500).json({ message: 'Error fetching thread detail', error });
  }
}
