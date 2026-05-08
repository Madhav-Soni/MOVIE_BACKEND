import User from "../Schema/userSchema.js";
import Movie from "../Schema/movieSchema.js";

export const watchlistController = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user.watchlist || []);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const watchlistControllerSync = async (req, res) => {
    try {
        const { movieIds } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.watchlist = movieIds;
        await user.save();
        res.status(200).json({ message: "Watchlist synced", watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};