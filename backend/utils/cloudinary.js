const cloudinary = require("cloudinary").v2;
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Create Cloudinary storage for multer
 * @param {string} folderName - Folder name in Cloudinary
 * @returns {CloudinaryStorage}
 */
const createCloudinaryStorage = (folderName) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: `ecommerce/${folderName}`,
            allowed_formats: ["png", "jpg", "jpeg", "webp"],
            transformation: [{ quality: "auto:good", fetch_format: "auto" }],
            public_id: (req, file) => {
                const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e6);
                const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
                return `${uniqueSuffix}_${ext}`;
            },
        },
    });
};

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folderName - Folder name in Cloudinary
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadToCloudinary = async (filePath, folderName) => {
    const result = await cloudinary.uploader.upload(filePath, {
        folder: `ecommerce/${folderName}`,
        resource_type: "image",
        transformation: [{ quality: "auto:good", fetch_format: "auto" }],
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
    }
};

/**
 * Delete multiple files from Cloudinary
 * @param {string[]} publicIds - Array of public IDs to delete
 * @returns {Promise<void>}
 */
const deleteMultipleFromCloudinary = async (publicIds) => {
    if (!publicIds || publicIds.length === 0) return;

    try {
        await Promise.all(publicIds.map((id) => deleteFromCloudinary(id)));
    } catch (error) {
        console.error("Error deleting images from Cloudinary:", error);
    }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - Cloudinary URL
 * @returns {string}
 */
const extractPublicIdFromUrl = (url) => {
    if (!url) return null;

    const parts = url.split("/");
    const publicIdWithExt = parts.pop();
    const publicId = publicIdWithExt.split(".")[0];

    return publicId;
};

module.exports = {
    cloudinary,
    createCloudinaryStorage,
    uploadToCloudinary,
    deleteFromCloudinary,
    deleteMultipleFromCloudinary,
    extractPublicIdFromUrl,
};
