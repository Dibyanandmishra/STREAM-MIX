import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comments.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
// Public: fetch comments
router.route("/:videoId").get(getVideoComments);
// Protected: create/update/delete comments
router.route("/:videoId").post(verifyJWT, addComment);
router.route("/c/:commentId").delete(verifyJWT, deleteComment).patch(verifyJWT, updateComment);

export default router