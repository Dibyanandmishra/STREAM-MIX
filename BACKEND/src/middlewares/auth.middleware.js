import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Unauthorized request... check auth.middlewares file")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid Access Token... check auth.middlewares file")
        }

        req.user = user;
        if (typeof next === "function") return next();
        throw new ApiError(500, "Express middleware error: next is not a function");
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token... check auth.middleware.js file... ERR: ", error?.message)
    }

})