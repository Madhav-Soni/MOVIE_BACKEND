import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 10,

    message: {
        message:
            "Too many requests. Try again later."
    },

    standardHeaders: true,

    legacyHeaders: false
});