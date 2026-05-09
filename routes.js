import express from "express";
const router = express.Router();

//middleware
import { verifyToken } from "./middleware/verifyToken.js";
import { authLimiter } from "./middleware/limiter.js";
//auth
import { signupController } from "./auth/signup.js";
import { loginController } from "./auth/login.js";
router.post("/signup",authLimiter, signupController);
router.post("/login", authLimiter, loginController);

//recommendationRoutes
import { recommendationController } from "./recommendation/recommendationController.js";
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
import { getPreferenceController,preferenceController } from "./preferences/preferenceController.js";
router.get("/preferences/:userId", verifyToken, getPreferenceController);
router.put("/preferences/:userId", verifyToken, preferenceController);

export default router;