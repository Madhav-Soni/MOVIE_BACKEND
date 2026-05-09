import axios from "axios";
import User from "../Schema/userSchema.js";
import mongoose from "mongoose";

const genreMap = {
    "Action": 28,
    "Adventure": 12,
    "Animation": 16,
    "Comedy": 35,
    "Crime": 80,
    "Documentary": 99,
    "Drama": 18,
    "Family": 10751,
    "Fantasy": 14,
    "History": 36,
    "Horror": 27,
    "Music": 10402,
    "Mystery": 9648,
    "Romance": 10749,
    "Science Fiction": 878,
    "Sci-Fi": 878,
    "SciFi": 878,
    "TV Movie": 10770,
    "Thriller": 53,
    "War": 10752,
    "Western": 37
};

export const recommendationController = async (req, res) => {
    try {
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

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (
            (!user.favoriteActors ||
                user.favoriteActors.length === 0) &&

            (!user.favoriteGenres ||
                user.favoriteGenres.length === 0)
        ) {
            return res.status(200).json([]);
        }

        const genreIds =
            user.favoriteGenres
                .map(genre => genreMap[genre]).filter(Boolean);

        if (genreIds.length === 0) {
            return res.status(200).json([]);
        }

        const response = await axios.get(
            "https://api.themoviedb.org/3/discover/movie",
            {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    with_genres: genreIds.join(","),
                    sort_by: "popularity.desc"
                }
            }
        );

        return res.status(200).json(
            response.data.results.slice(0, 20)
        );
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};