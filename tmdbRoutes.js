import express from "express";
const router = express.Router();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

import { verifyToken }
from "./middleware/verifyToken.js";

router.use(verifyToken);

router.use(async (req, res) => {
    try {
        const path = req.path;

        const queryParams = new URLSearchParams(req.query);
        queryParams.append("api_key", process.env.TMDB_KEY);

        const tmdbUrl = `${TMDB_BASE_URL}${path}?${queryParams.toString()}`;

        const response = await fetch(tmdbUrl);
        if (!response.ok) {
            return res.status(response.status).json({ message: `TMDB Error: ${response.statusText}` });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("TMDB Proxy Error:", error);
        res.status(500).json({ message: "Internal server error connecting to TMDB" });
    }
});

export default router;
