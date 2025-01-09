import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function getRepliesThread(req: Request, res: Response) {
  try {
    const { threadId } = req.params;
    const numericThreadId = Number(threadId);

    if (isNaN(numericThreadId)) {
      return res.status(400).json({ error: 'Invalid thread ID' });
    }

    const replies = await prisma.reply.findMany({
      where: {
        threadId: numericThreadId,
      },
      include: {
        author: {
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
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return res.status(500).json({ error: 'Failed to fetch replies' });
  }
}

export async function createReply(req: Request, res: Response) {
  const { content } = req.body;
  const threadId = parseInt(req.params.id);
  const { id: authorId } = (req as any).user;

  if (isNaN(threadId)) {
    return res.status(400).json({ message: 'Invalid thread ID' });
  }
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Content cannot be empty' });
  }
  if (!authorId) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }

  const file = req.file?.path || null;

  try {
    const reply = await prisma.reply.create({
      data: {
        threadId,
        content: content.trim(),
        authorId,
        image: file,
      },
      include: {
        author: {
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
        },
      },
    });

    return res
      .status(201)
      .json({ reply, message: 'Reply created successfully' });
  } catch (error) {
    console.error('Error creating reply:', error);
    return res.status(500).json({ message: 'Failed to create reply' });
  }
}

export async function updateReplies(req: Request, res: Response) {
  const replyId = parseInt(req.params.id);
  const { content } = req.body;
  const { id: userId } = (req as any).user;

  try {
    const existingReply = await prisma.reply.findUnique({
      where: { id: replyId },
    });

    if (!existingReply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    if (existingReply.authorId !== userId) {
      return res.status(403).json({
        message: 'You are not authorized to update this reply',
      });
    }

    const file = req.file?.path || existingReply.image;

    const updatedReply = await prisma.reply.update({
      where: { id: replyId },
      data: {
        content: content || existingReply.content,
        image: file,
      },
      include: { author: true },
    });

    res.status(200).json({
      message: 'Reply updated successfully',
      reply: updatedReply,
    });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Failed to update reply' });
  }
}

export async function deleteReplies(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.reply.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ message: 'Reply deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete reply' });
  }
}
