import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

// Prevent duplicates per content type/user.
// "sparse" allows documents that only set one of video/comment/tweet fields.
likeSchema.index({ video: 1, likedBy: 1 }, { unique: true, sparse: true })
likeSchema.index({ comment: 1, likedBy: 1 }, { unique: true, sparse: true })
likeSchema.index({ tweet: 1, likedBy: 1 }, { unique: true, sparse: true })

export const Like = mongoose.model("Like", likeSchema)