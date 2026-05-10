import rateLimit from "express-rate-limit";
import RateLimitMongo from "rate-limit-mongo";

export const authLimiter = rateLimit({
    store: new RateLimitMongo({
        uri: process.env.MONGODB_URI,
        collectionName: "rateLimits",
        // windowMs should match the store's expireTimeMs
        expireTimeMs: 15 * 60 * 1000,
    }),
    windowMs: 15 * 60 * 1000,

    max: 10,

    message: {
        message:
            "Too many requests. Try again later."
    },

    standardHeaders: true,

    legacyHeaders: false
});