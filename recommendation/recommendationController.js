import User from "../Schema/userSchema.js";
import Movie from "../Schema/movieSchema.js";
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

export const recommendationController =  async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const movies = await Movie.find({});

        const scoredMovies = movies.map(movie => {
            let score = 0;

            // Actor match: +5 per actor
            if (movie.actors && user.favoriteActors) {
                const actorMatches = movie.actors.filter(actor => user.favoriteActors.includes(actor)).length;
                score += actorMatches * 5;
            }

            // Genre match: +4 per genre
            if (movie.genres && user.favoriteGenres) {
                const genreMatches = movie.genres.filter(genre => user.favoriteGenres.includes(genre)).length;
                score += genreMatches * 4;
            }

            // Rating & Popularity Boosts (if movie has a score > 0 from actors/genres)
            if (score > 0) {
                if (movie.rating) {
                    score += movie.rating / 2; // e.g., 8.0 rating = +4 score
                }
                if (movie.popularity) {
                    score += Math.min(movie.popularity / 100, 5); // cap popularity boost at 5
                }
            }

            return { movie, score };
        });

        // Filter out zero-score movies
        const validMovies = scoredMovies.filter(item => item.score > 0);

        validMovies.sort((a, b) => b.score - a.score);

        const topMovies = validMovies.slice(0, 10).map(item => item.movie);

        res.status(200).json(topMovies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};