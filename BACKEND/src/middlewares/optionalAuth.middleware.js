import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// Like verifyJWT but optional: if no/invalid token is present we just proceed
// without `req.user` (so public GETs still work).
const optionalVerifyJWT = async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return next();

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (user) req.user = user;
    } catch (err) {
        // Ignore invalid/expired tokens for optional auth.
    }

    return next();
};

export { optionalVerifyJWT };

