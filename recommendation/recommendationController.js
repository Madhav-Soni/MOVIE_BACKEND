import axios from "axios";
import User from "../Schema/userSchema.js";
import mongoose from "mongoose";

const genreMap = {
    Action: 28,
    Comedy: 35,
    Drama: 18,
    Horror: 27,
    Romance: 10749,
    SciFi: 878
};

export const recommendationController =
    async (req, res) => {

        try {

            const { userId } = req.params;

            if (
                !mongoose.Types.ObjectId.isValid(userId)
            ) {
                return res.status(400).json({
                    message: "Invalid user ID"
                });
            }

            if (
                req.user._id.toString() !==
                userId.toString()
            ) {
                return res.status(403).json({
                    message: "Unauthorized access"
                });
            }

            const user =
                await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const genreIds =
                user.favoriteGenres.map(
                    genre => genreMap[genre]
                );

            const response = await axios.get(
                "https://api.themoviedb.org/3/discover/movie",
                {
                    params: {
                        api_key: process.env.TMDB_API_KEY,
                        with_cast: user.favoriteActors.join(","),
                        with_genres: genreIds.join(","),
                        sort_by: "popularity.desc"
                    }
                }
            );

            return res.status(200).json(
                response.data.results
            );

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };