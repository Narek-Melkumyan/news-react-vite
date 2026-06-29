import { rateLimit } from "express-rate-limit";

export const searchRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 3,
    standardHeaders: "draft-8",
    legacyHeaders: false,

    message: {
        message: "Too many searches. Please try again later.",
        articles: []
    }
});