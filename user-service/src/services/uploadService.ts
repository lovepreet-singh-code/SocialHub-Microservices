import cloudinary from '../config/cloudinary';
import AppError from '../utils/AppError';
import streamifier from 'streamifier';

interface UploadResult {
  url: string;
  publicId: string;
}

class UploadService {
  async uploadImage(fileBuffer: Buffer, folder: string = 'avatars'): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            reject(new AppError('Failed to upload image to Cloudinary', 500));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(new AppError('Upload failed - no result returned', 500));
          }
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
      throw new AppError('Failed to delete image', 500);
    }
  }
}

export default new UploadService();
