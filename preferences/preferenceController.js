import User from "../Schema/userSchema.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

export const preferenceController = async (req, res) => {
    try {
        const { userId } = req.params;
        const { favoriteActors, favoriteGenres } = req.body;

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