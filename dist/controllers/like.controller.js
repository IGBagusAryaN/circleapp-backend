"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLike = getAllLike;
exports.toggleLikeThread = toggleLikeThread;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getAllLike(req, res) {
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
    }
    catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ message: 'Error fetching likes', error });
    }
}
async function toggleLikeThread(req, res) {
    const threadId = parseInt(req.params.id);
    const userId = req?.user?.id;
    if (isNaN(threadId)) {
        return res.status(400).json({ message: 'Invalid thread ID' });
    }
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const existingThread = await prisma.thread.findUnique({
            where: { id: threadId },
        });
        if (!existingThread) {
            return res.status(404).json({ message: 'Thread not found' });
        }
        const existingLike = await prisma.like.findFirst({
            where: { userId, threadId },
        });
        if (existingLike) {
            // console.log("Existing like found:", existingLike);
            await prisma.like.update({
                where: { id: existingLike.id },
                data: {
                    isDeleted: existingLike.isDeleted === 0 ? 1 : 0,
                    deletedAt: existingLike.isDeleted === 0 ? new Date() : null,
                },
            });
        }
        else {
            // console.log("No existing like, creating new like");
            await prisma.like.create({
                data: {
                    userId,
                    threadId,
                    isDeleted: 0,
                },
            });
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
        return res.status(200).json({
            message: 'Toggle like successfully',
            totalLikes,
            likedUsers,
        });
    }
    catch (error) {
        console.error('Error toggling like thread:', error);
        return res.status(500).json({
            message: 'Error toggling like thread',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
