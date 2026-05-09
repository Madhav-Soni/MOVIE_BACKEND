import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";

import Movie from "./Schema/movieSchema.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB connected");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const movieResponse = await axios.get(
    "https://api.themoviedb.org/3/movie/popular",
    {
        params: {
            api_key: process.env.TMDB_API_KEY,
            with_cast: user.favoriteActors.join(","),
            with_genres: genreIds.join(","),
            sort_by: "popularity.desc"
        }
    }
);

const movies = movieResponse.data.results;