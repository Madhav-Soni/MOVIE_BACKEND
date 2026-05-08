import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },


    id: Number,
    favoriteActors: [Number],
    favoriteGenres: [String],

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