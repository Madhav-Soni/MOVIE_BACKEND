import User from "../Schema/userSchema.js";

export const watchlistController = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized access"
            });
        }
        res.status(200).json(user.watchlist || []);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const watchlistControllerSync = async (req, res) => {
    try {
        const { movieIds } = req.body;
        if (!Array.isArray(movieIds)) {
            return res.status(400).json({ message: "movieIds must be an array" });
        }

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (req.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized access"
            });
        }
        user.watchlist = movieIds;
        await user.save();
        res.status(200).json({ message: "Watchlist synced", watchlist: user.watchlist });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};