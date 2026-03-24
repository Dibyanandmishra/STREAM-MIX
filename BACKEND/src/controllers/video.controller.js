import mongoose from "mongoose"
import { Video } from "../models/video.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

    const skip = (page - 1) * limit;

    const filter = {};

    if (query) {
        filter.title = { $regex: query, $options: "i" };
    }

    if (userId) {
        filter.owner = userId;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortType === "asc" ? 1 : -1;

    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

    return res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    if (!title || title?.trim() === "") {
        throw new ApiError(400, "Title is required")
    }

    if (!req.files?.videoFile?.length) {
        throw new ApiError(400, "Video is required")
    }

    const videoFileLocalPath = req.files.videoFile[0].path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    const videoUploaded = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnailUploaded = thumbnailLocalPath ? await uploadOnCloudinary(thumbnailLocalPath) : null;

    if (!videoUploaded?.url) {
        throw new ApiError(500, "Video upload failed")
    }

    const videoPublished = await Video.create({
        title,
        description,
        thumbnail: thumbnailUploaded?.url || "",
        videoFile: videoUploaded.url,
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, videoPublished, "Video published successfully")
    );
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Video Id is invalid")
    }

    const video = await Video.findById(videoId)
        .populate("owner", "username avatar fullName")

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Video Id is invalid")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to Update details of this video")
    }

    const updateData = {}

    if (title?.trim()) updateData.title = title;
    if (description?.trim()) updateData.description = description;

    if (req.file?.path) {
        const thumbnailUploaded = await uploadOnCloudinary(req.files.path)
        if (!thumbnailUploaded?.url) {
            throw new ApiError(500, "Thumbnail upload failed")
        }
        updateData.thumbnail = thumbnailUploaded.url
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: updateData },
        { new: true }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video updated successfully")
    );
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Video Id is invalid")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video")
    }

    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    );
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Video Id is invalid")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video")
    }

    video.isPublished = !video.isPublished

    await video.save({ validateBeforeSave: false })

    return res.status(200).json(
        new ApiResponse(
            200,
            { isPublished: video.isPublished },
            "Publish status updated successfully"
        )
    );
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideoDetails,
    deleteVideo,
    togglePublishStatus
}