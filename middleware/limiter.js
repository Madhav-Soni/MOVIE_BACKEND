import dotenv from "dotenv";
dotenv.config();

import rateLimit from "express-rate-limit";
import RateLimitMongo from "rate-limit-mongo";

export const authLimiter = rateLimit({
  store: process.env.MONGODB_URI
    ? new RateLimitMongo({
        uri: process.env.MONGODB_URI,
        collectionName: "rateLimits",
        expireTimeMs: 15 * 60 * 1000,
      })
    : undefined,

  windowMs: 15 * 60 * 1000,

  max: 10,

  message: {
    message: "Too many requests. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});