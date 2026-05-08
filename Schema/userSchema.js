import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    favoriteActors: {
        type: [Number],
        default: []
    },

    favoriteGenres: {
        type: [String],
        default: []
    },

    watchlist: {
        type: [Number],
        default: []
    },

    watchHistory: [
        {
            movieId: Number,
            watchedAt: Date,
        },
    ],

    ratings: [
        {
            movieId: Number,
            rating: Number,
        },
    ],
});

const User = mongoose.model('User', userSchema);

export default User;