import multer, { MulterError } from 'multer';
import { NextFunction, Request, Response } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    format: async (req: Request, file: Express.Multer.File) => 'jpg',
    public_id: (req: Request, file: Express.Multer.File) =>
      `${Date.now()}-${file.originalname}`,
  } as any,
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed') as any, false);
  }
};

export function upload(
  uploadType: 'single' | 'multiple',
  fieldName: string,
  fields?: multer.Field[],
) {
  const uploadMiddleware =
    uploadType === 'single'
      ? multer({ storage, fileFilter }).single(fieldName)
      : multer({ storage, fileFilter }).fields(fields || []);

  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof MulterError || err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  };
}
