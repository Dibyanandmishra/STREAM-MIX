import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (fileBuffer) => {
    try {
        return await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            stream.end(fileBuffer);
        });
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

const extractPublicIdFromCloudinaryUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    // Common format: .../upload/v<version>/<public_id>.<ext>
    const match =
        url.match(/\/upload\/v\d+\/(.+)\.[^\/\.]+$/) ||
        url.match(/\/(?:image|video)\/upload\/v\d+\/(.+)\.[^\/\.]+$/);

    return match?.[1] || null;
};

const deleteFromCloudinary = async (resourceUrl) => {
    const publicId = extractPublicIdFromCloudinaryUrl(resourceUrl);
    if (!publicId) return false;

    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (err) {
        // Defensive: never block user requests due to cleanup issues.
        console.error("Cloudinary delete error:", err?.message || err);
        return false;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };