"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProfile = getAllProfile;
exports.createProfile = createProfile;
exports.updateProfile = updateProfile;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getAllProfile(req, res) {
    try {
        const allThreads = await prisma.profile.findMany({
            select: {
                fullname: true,
                bio: true,
                bannerImage: true,
                profileImage: true,
                userId: true,
            },
        });
        res
            .status(200)
            .json({ message: 'Get all threads succesfully', threads: allThreads });
    }
    catch (error) {
        res.status(400).json({ message: 'Error fetching all threads', error });
    }
}
async function createProfile(req, res) {
    try {
        const userId = parseInt(req.body.userId);
        const { fullname, bio } = req.body;
        if (!userId || isNaN(userId)) {
            return res
                .status(400)
                .json({ message: 'Bad Request: userId must be a valid integer' });
        }
        const files = req.files || {};
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (files['profileImage'] &&
            !allowedMimeTypes.includes(files['profileImage'][0].mimetype)) {
            return res.status(400).json({ message: 'Invalid profile image format' });
        }
        if (files['bannerImage'] &&
            !allowedMimeTypes.includes(files['bannerImage'][0].mimetype)) {
            return res.status(400).json({ message: 'Invalid banner image format' });
        }
        const profileImage = files?.['profileImage']?.[0]?.path || null;
        const bannerImage = files?.['bannerImage']?.[0]?.path || null;
        const existingProfile = await prisma.profile.findUnique({
            where: { userId },
        });
        if (existingProfile) {
            return res.status(400).json({
                message: 'Profile already exists for this user',
                profile: existingProfile,
            });
        }
        const newProfile = await prisma.profile.create({
            data: {
                fullname: fullname || null,
                bio: bio || null,
                profileImage: profileImage || null,
                bannerImage: bannerImage || null,
                userId,
            },
        });
        res.status(201).json({
            message: 'Profile created successfully',
            profile: newProfile,
        });
    }
    catch (error) {
        console.error('Error creating profile:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            return res.status(500).json({
                message: 'Database error occurred',
                error: error.message,
            });
        }
        res.status(500).json({
            message: 'An unexpected error occurred while creating the profile',
            error: error instanceof Error ? error.message : error,
        });
    }
}
async function updateProfile(req, res) {
    try {
        const userId = parseInt(req.user.id, 10);
        if (!userId || isNaN(userId)) {
            return res.status(401).json({ message: 'Unauthorized: Invalid User ID' });
        }
        const { fullname, bio, username } = req.body;
        const files = req.files || {};
        console.log('Files received:', files);
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (files['profileImage'] &&
            !allowedMimeTypes.includes(files['profileImage'][0].mimetype)) {
            return res.status(400).json({ message: 'Invalid profile image format' });
        }
        if (files['bannerImage'] &&
            !allowedMimeTypes.includes(files['bannerImage'][0].mimetype)) {
            return res.status(400).json({ message: 'Invalid banner image format' });
        }
        const profileImage = files?.['profileImage']?.[0]?.path || null;
        const bannerImage = files?.['bannerImage']?.[0]?.path || null;
        console.log('Profile Image Path:', profileImage);
        console.log('Banner Image Path:', bannerImage);
        if (username) {
            const existingUser = await prisma.user.findUnique({
                where: { username },
            });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ message: 'Username is already taken' });
            }
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                username: username || undefined,
            },
        });
        const existingProfile = await prisma.profile.findUnique({
            where: { userId },
        });
        let updatedProfile;
        if (!existingProfile) {
            updatedProfile = await prisma.profile.create({
                data: {
                    userId,
                    fullname: fullname || '',
                    bio: bio || '',
                    profileImage: profileImage || null,
                    bannerImage: bannerImage || null,
                },
            });
        }
        else {
            updatedProfile = await prisma.profile.update({
                where: { userId },
                data: {
                    fullname: fullname || existingProfile.fullname,
                    bio: bio || existingProfile.bio,
                    profileImage: profileImage || existingProfile.profileImage,
                    bannerImage: bannerImage || existingProfile.bannerImage,
                },
            });
        }
        console.log('Updated Profile:', updatedProfile);
        res.status(200).json({
            message: 'Profile updated successfully',
            profile: updatedProfile,
        });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            message: 'An unexpected error occurred while updating the profile',
        });
    }
}
