const multer = require("multer");
const { createCloudinaryStorage } = require("../utils/cloudinary");
const path = require("path");

const allowedExt = [".png", ".jpg", ".jpeg", ".webp"];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) {
        return cb(new Error("Only images allowed (.png, .jpg, .jpeg, .webp)"), false);
    }
    cb(null, true);
};

const MG = 1024 * 1024;

const upload = (folderName) => {
    return multer({
        storage: createCloudinaryStorage(folderName),
        fileFilter,
        limits: { fileSize: 5 * MG },
    });
};

module.exports = { upload };
