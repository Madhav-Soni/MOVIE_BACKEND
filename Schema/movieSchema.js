import mongoose from 'mongoose';


const movieSchema = new mongoose.Schema({
    tmdbId: Number,
    title: String,
    genres:[String],
    actors:[Number],
    rating: Number,
    popularity: Number,
});

const movie = mongoose.model('movie', movieSchema);

export default movie;