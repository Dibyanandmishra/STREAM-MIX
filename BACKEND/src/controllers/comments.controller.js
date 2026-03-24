import mongoose from "mongoose"
import { Comment } from "../models/comments.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const isValidVideoId = mongoose.Types.ObjectId.isValid(videoId);
    if (!isValidVideoId) {
        throw new ApiError(400, "Invalid video id");
    }

    const { page = 1, limit = 10 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;


    const totalComment = await Comment.countDocuments({ video: videoId });

    const comments = await Comment.find({ video: videoId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                comments,
                page: pageNum,
                limit: limitNum,
                totalComment
            },
            "Video comments fetched successfully"
        )
    );
});

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const isVideoIdValid = mongoose.Types.ObjectId.isValid(videoId);
    if (!isVideoIdValid) {
        throw new ApiError(400, "Video id is invalid");
    }

    const { content } = req.body;
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Entering empty Comment content is not allowed");
    }

    const userId = req.user._id;
    if (!userId) {
        throw new ApiError(401, "User is not Authorized");
    }

    const comment = await Comment.create({
        content: content.trim(),
        video: videoId,
        owner: userId
    })
    const populatedComment = await Comment.findById(comment._id)
        .populate("owner", "username avatar");

    return res.status(201).json(
        new ApiResponse(
            201,
            populatedComment,
            "Comment added successfully"
        )
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const isCommentIdValid = mongoose.Types.ObjectId.isValid(commentId);
    if (!isCommentIdValid) {
        throw new ApiError(400, "Invalid comment id");
    }

    const { content } = req.body;
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Comment content cannot be empty");
    }

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment");
    }

    comment.content = content.trim();
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
        .populate("owner", "username avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        )
    );
});


const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const isValidCommentId = mongoose.Types.ObjectId.isValid(commentId);
    if (!isValidCommentId) {
        throw new ApiError(400, "Invalid comment id");
    }

    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this comment");
    }

    await comment.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Comment deleted successfully"
        )
    );
});


export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}