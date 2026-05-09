import User from "../Schema/userSchema.js";
import mongoose from "mongoose";

export const getPreferenceController = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            favoriteActors:
                user.favoriteActors,

            favoriteGenres:
                user.favoriteGenres
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const preferenceController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { favoriteActors, favoriteGenres } = req.body;
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

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (favoriteActors !== undefined) {
            user.favoriteActors = favoriteActors;
        }
        if (favoriteGenres !== undefined) {
            user.favoriteGenres = favoriteGenres;
        }

        await user.save();
        res.status(200).json({ message: "Preferences updated successfully", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};