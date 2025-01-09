"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFollow = getAllFollow;
exports.toggleFollow = toggleFollow;
exports.checkFollowStatus = checkFollowStatus;
exports.getFollowing = getFollowing;
exports.getFollowers = getFollowers;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getAllFollow(req, res) {
    try {
        const allFollow = await prisma.follow.findMany();
        res.status(200).json(allFollow);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching follows', error });
    }
}
async function toggleFollow(req, res) {
    const followerId = parseInt(req.params.id); // id user yang mau di-follow
    const { id: followingId } = req.user; // id user yang login
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
        }
        else {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error toggling follow status', error });
    }
}
async function checkFollowStatus(req, res) {
    const followerId = parseInt(req.params.id);
    const { id: followingId } = req.user;
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error checking follow status', error });
    }
}
async function getFollowing(req, res) {
    const userId = req.user.id;
    try {
        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                following: true, // ambil data user yang difollow
            },
        });
        res.status(200).json(following);
    }
    catch (error) {
        console.error('Error fetching following:', error);
        res.status(500).json({ message: 'Error fetching following' });
    }
}
async function getFollowers(req, res) {
    const userId = req.user.id;
    try {
        const followers = await prisma.follow.findMany({
            where: { followingId: userId },
            include: {
                follower: true, // ambil data user yang memfollow
            },
        });
        res.status(200).json(followers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching followers' });
    }
}
