import { ApiError } from "../utils/ApiError.js";

// Simple CSRF mitigation for cookie-based auth:
// For "state-changing" requests we require the browser `Origin` to match the configured CORS origin.
// This is not a full CSRF-token solution, but it blocks most cross-site form submissions.
const originGuard = (req, res, next) => {
    const stateChangingMethods = ["POST", "PUT", "PATCH", "DELETE"];
    if (!stateChangingMethods.includes(req.method)) return next();

    const allowedOrigin = process.env.CORS_ORIGIN;
    const origin = req.headers.origin;

    // If Origin header is missing, be strict and reject.
    if (!origin || origin !== allowedOrigin) {
        return next(new ApiError(403, "Forbidden: invalid request origin"));
    }

    return next();
};

export { originGuard };

