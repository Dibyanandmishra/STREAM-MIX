import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const healthcheck = asyncHandler(async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            status: "OK",
            message: "Server is running fine"
        })
    } catch (error) {
        throw new ApiError(400, "ApiError: ", error?.message);
    }
})

export { healthcheck }