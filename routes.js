import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";

import User from "./Schema/userSchema.js";
import Movie from "./Schema/movieSchema.js";

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const normalizedEmail = email.toLowerCase();
        const checkExistingUser = await User.findOne({ email: normalizedEmail });
        if (checkExistingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 7);
        const newUser =await User.create({ name, email: normalizedEmail, password: hashedPassword });

        res.status(201).json({
            message: "User created successfully",
            userId: newUser._id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const normalizedEmail = email.toLowerCase();
        const checkExistingUser = await User.findOne({ email: normalizedEmail });
        if (!checkExistingUser) {
            return res.status(400).json({ message: "Login Details don't match" });
        }

        const comparePassword = await bcrypt.compare(password, checkExistingUser.password);
        if (!comparePassword) {
            return res.status(400).json({ message: "Password don't match" });
        }
        res.status(200).json({ message: "Login Done!!!", userId: checkExistingUser._id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/recommendations/:userId", async (req, res) => {
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
});

router.put("/preferences/:userId", async (req, res) => {
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
});

export default router;