import mongoose from "mongoose"
import { Like } from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const userId = req.user._id

    const existedLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    })

    if (existedLike) {
        await Like.deleteOne({ _id: existedLike._id })

        return res.status(200).json(
            new ApiResponse(200, {}, "Like removed from video")
        )
    }

    let createdLike;
    try {
        createdLike = await Like.create({
            video: videoId,
            likedBy: userId
        })
    } catch (err) {
        // Handle rare race conditions (duplicate key) by treating it as "already liked".
        if (err?.code === 11000) {
            const likeFromRace = await Like.findOne({ video: videoId, likedBy: userId })
            if (likeFromRace) {
                await Like.deleteOne({ _id: likeFromRace._id })
                return res.status(200).json(new ApiResponse(200, {}, "Like removed from video"))
            }
        }
        throw err
    }

    return res.status(200).json(
        new ApiResponse(200, createdLike, "Video liked successfully")
    )
})


const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment id");
    }

    const userId = req.user._id;

    const existedLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })
    if (existedLike) {
        await Like.deleteOne({ _id: existedLike._id });

        return res.status(200).json(new ApiResponse(200, {}, "Like Removed from Comment"))
    }

    let createdLike;
    try {
        createdLike = await Like.create({
            comment: commentId,
            likedBy: userId
        })
    } catch (err) {
        if (err?.code === 11000) {
            const likeFromRace = await Like.findOne({ comment: commentId, likedBy: userId })
            if (likeFromRace) {
                await Like.deleteOne({ _id: likeFromRace._id })
                return res.status(200).json(new ApiResponse(200, {}, "Like Removed from Comment"))
            }
        }
        throw err
    }

    return res.status(200).json(new ApiResponse(200, { createdLike }, "Comment liked successfully"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid Tweet id");
    }

    const userId = req.user._id;

    const existedLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    })
    if (existedLike) {
        await Like.deleteOne({ _id: existedLike._id });

        return res.status(200).json(new ApiResponse(200, {}, "Like Removed from tweet"))
    }

    let createdLike;
    try {
        createdLike = await Like.create({
            tweet: tweetId,
            likedBy: userId
        })
    } catch (err) {
        if (err?.code === 11000) {
            const likeFromRace = await Like.findOne({ tweet: tweetId, likedBy: userId })
            if (likeFromRace) {
                await Like.deleteOne({ _id: likeFromRace._id })
                return res.status(200).json(new ApiResponse(200, {}, "Like Removed from tweet"))
            }
        }
        throw err
    }

    return res.status(200).json(new ApiResponse(200, { createdLike }, "tweet liked successfully"))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: { $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            }
        },
        { $unwind: "$video" },
        { $replaceRoot: { newRoot: "$video" } },
        { $sort: { createdAt: -1 } }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            likedVideos,
            "Liked videos fetched successfully"
        )
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}