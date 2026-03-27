const multer = require("multer");
const path = require("path");

const allowedExt = [".png", ".jpg", ".jpeg", ".webp"];

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) {
        return cb(new Error("Only images allowed (.png, .jpg, .jpeg, .webp)"), false);
    }
    cb(null, true);
};

const storage = (folderName) => {
    return multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, path.join(__dirname, `../uploads/${folderName}`));
        },
        filename: (request, file, cb) => {
            const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e6);
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, uniqueSuffix + ext);
        },
    });
};

const MG = 1024 * 1024;

const upload = (folderName) => {
    return multer({
        storage: storage(folderName),
        fileFilter,
        limits: { fileSize: 5 * MG },
    });
};

module.exports = { upload };
