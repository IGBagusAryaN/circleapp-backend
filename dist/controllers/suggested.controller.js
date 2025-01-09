"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestedUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSuggestedUsers = async (req, res) => {
    try {
        const loggedInUserId = res.locals.userId;
        const suggestedUsers = await prisma.user.findMany({
            where: {
                id: {
                    not: loggedInUserId,
                },
                followers: {
                    none: {
                        followingId: loggedInUserId,
                    },
                },
            },
            include: {
                followers: {
                    select: {
                        followerId: true,
                    },
                },
                profile: true,
            },
            take: 4,
        });
        const enrichedUsers = suggestedUsers.map((user) => ({
            id: user.id,
            email: user.email,
            username: user.username,
            isFollowingUs: user.followers.some((follow) => follow.followerId === loggedInUserId),
            fullname: user.profile?.[0]?.fullname || 'Unknown User',
            profileImage: user.profile?.[0]?.profileImage || 'default-image-url',
            followerCount: user.followers.length,
        }));
        const sortedUsers = enrichedUsers.sort((a, b) => {
            if (a.isFollowingUs && !b.isFollowingUs)
                return -1;
            if (!a.isFollowingUs && b.isFollowingUs)
                return 1;
            return b.followerCount - a.followerCount;
        });
        return res.status(200).json(sortedUsers);
    }
    catch (error) {
        console.error('Error fetching suggested users:', error);
        return res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data suggested users.',
        });
    }
};
exports.getSuggestedUsers = getSuggestedUsers;
