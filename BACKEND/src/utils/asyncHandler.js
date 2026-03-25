const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => {
            // Express should pass a valid `next` function. In some edge/runtime
            // contexts we still want a safe fallback to avoid "next is not a function".
            if (typeof next === "function") return next(err);
            if (res?.headersSent) return;

            const statusCode = err?.statusCode || 500;
            const message = err?.message || "Internal Server Error";
            const errors = err?.errors || [];

            return res.status(statusCode).json({
                success: false,
                message,
                errors,
            });
        });
    };
};

export { asyncHandler };
