import mongoose from "mongoose"
import { Subscription } from "../models/subscription.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Channel Id invalid")
    }

    const userId = req.user._id
    const existedSubscriber = await Subscription.findOne({
        channel: channelId,
        subscriber: userId
    })
    if (existedSubscriber) {
        await Subscription.deleteOne({ _id: existedSubscriber._id })

        return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed from channel successfully"))
    }

    const subscribed = await Subscription.create({
        channel: channelId,
        subscriber: userId
    })

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                subscribed,
                "Subscribed by user successfully"
            )
        )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "Subscriber Id invalid");
    }

    if (req.user._id.toString() !== subscriberId.toString()) {
        throw new ApiError(403, "You are not allowed to view this subscription list");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber"
            }
        },
        { $unwind: "$subscriber" },
        {
            $project: {
                _id: 0,
                subscriber: {
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    fullName: 1
                },
                subscribedAt: "$createdAt"
            }
        },
        { $sort: { subscribedAt: -1 } }
    ])

    return res.status(200).json(
        new ApiResponse(200, subscribers, "Channel subscribers fetched successfully")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Subscriber Id invalid");
    }

    if (req.user._id.toString() !== channelId.toString()) {
        throw new ApiError(403, "You are not allowed to view this subscription list");
    }

    const channels = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel"
            }
        },
        { $unwind: "$channel" },
        {
            $project: {
                _id: 0,
                channel: {
                    _id: 1,
                    username: 1,
                    avatar: 1,
                    fullName: 1
                },
                subscribedAt: "$createdAt"
            }
        },
        { $sort: { subscribedAt: -1 } }
    ])

    return res.status(200).json(
        new ApiResponse(
            200,
            channels,
            "Subscriber channels fetched successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}