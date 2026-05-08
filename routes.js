import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";

//auth
import { signupController } from "./auth/signup.js";
import { loginController } from "./auth/login.js";
router.post("/signup", signupController);
router.post("/login", loginController);

//recommendationRoutes
import { verifyToken,recommendationController } from "./recommendation/recommendationController.js";
router.get("/recommendations/:userId", verifyToken, recommendationController);

//watchlistRoutes
import { watchlistController } from "./watchlist/watchlistController.js";
import { watchlistControllerSync } from "./watchlist/watchlistController.js";
router.get("/watchlist/:userId", verifyToken, watchlistController);
router.post("/watchlist-sync/:userId", verifyToken, watchlistControllerSync);

// historyRoutes
import { historyController } from "./history/historyController.js";
router.post("/watched/:userId", verifyToken, historyController);


//preferenceRoutes
import { preferenceController } from "./preferences/preferenceController.js";
router.post("/preferences/:userId", verifyToken, preferenceController);

export default router;