import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { originGuard } from "./middlewares/originGuard.middleware.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "100kb" }))
app.use(express.urlencoded({ extended: true, limit: "100kb" }))
// No static file serving needed — uploads go directly to Cloudinary
app.use(cookieParser())

// CSRF mitigation for cookie-based auth.
// Must be registered before routes so state-changing requests are protected.
app.use(originGuard)


// routes import 
import userRouter from './routes/user.routes.js'
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comments.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

// routes declaration 
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// JSON 404 for unmatched routes (so frontend axios errors are consistent).
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Global error handler — must be after all routes
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
    });
});

export default app;
