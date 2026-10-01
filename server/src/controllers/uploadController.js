import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary if environment variables are present
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// @desc    Upload image (local or Cloudinary)
// @route   POST /api/upload
// @access  Private (Admin)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Check if Cloudinary is configured
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'mohamed-alaa-portfolio',
      });

      // Remove temp local file
      fs.unlinkSync(req.file.path);

      return res.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        storage: 'cloudinary',
      });
    }

    // Fallback: Local static serving
    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      storage: 'local',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
