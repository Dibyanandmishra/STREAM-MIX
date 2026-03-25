import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Field-based filtering since this uploader is shared.
    const field = file.fieldname;
    const mime = file.mimetype || "";

    const isImageField = ["avatar", "coverImage", "thumbnail", "cover-Image"].includes(field);
    const isVideoField = ["videoFile"].includes(field);

    if (isImageField) {
        if (!mime.startsWith("image/")) {
            return cb(new ApiError(400, "Only image uploads are allowed for this field"));
        }
        return cb(null, true);
    }

    if (isVideoField) {
        if (!mime.startsWith("video/")) {
            return cb(new ApiError(400, "Only video uploads are allowed for this field"));
        }
        return cb(null, true);
    }

    // Default deny for unknown fields.
    return cb(new ApiError(400, "Unsupported upload field"));
};

export const upload = multer({
    storage,
    fileFilter,
    // Memory storage means we must cap file size to avoid exhausting RAM on Render.
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
