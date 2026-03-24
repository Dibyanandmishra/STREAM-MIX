import mongoose from "mongoose"
import { Video } from "../models/video.models.js"
import { Subscription } from "../models/subscription.models.js"
import { Like } from "../models/like.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id
    const totalVideos = await Video.countDocuments({ owner: channelId })

    const viewsAgg = await Video.aggregate([
        { $match: { owner: channelId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);

    const totalViews = viewsAgg[0]?.totalViews || 0;

    const likesAgg = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            }
        },
        { $unwind: "$video" },
        { $match: { "video.owner": channelId } },
        { $count: "totalLikes" }
    ]);

    const totalLikes = likesAgg[0]?.totalLikes || 0;

    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId
    });

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalViews,
            totalLikes,
            totalSubscribers
        }, "Dashboard stats fetched")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const videos = await Video.find({ owner: channelId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);

    const totalVideos = await Video.countDocuments({ owner: channelId })

    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            totalVideos,
            page: pageNumber,
            limit: limitNumber
        }, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats,
    getChannelVideos
}