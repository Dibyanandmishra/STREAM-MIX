import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideoDetails,
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { optionalVerifyJWT } from "../middlewares/optionalAuth.middleware.js"

const router = Router();

// Public routes (no auth required)
router.route("/").get(getAllVideos);

router
    .route("/")
    .post(
        verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },

        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .get(optionalVerifyJWT, getVideoById)
    .delete(verifyJWT, deleteVideo)
    .patch(verifyJWT, upload.single("thumbnail"), updateVideoDetails);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router