import User from "../Schema/userSchema.js";
import mongoose from "mongoose";

export const historyController = async (req, res) => {
    try {
        const { movieId } = req.body;
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }
        
        if (req.user._id.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Unauthorized access"
            });
        }
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.watchHistory.push({
            movieId,
            watchedAt: new Date()
        });

        await user.save();
        res.status(200).json({ message: "Watched history updated", watchHistory: user.watchHistory });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};