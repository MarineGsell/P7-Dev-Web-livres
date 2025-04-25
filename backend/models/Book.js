const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String},
    imageUrl: { type: String, required: true },
    year: { type: Number},
    genre: { type: String},
    ratings: [{
        userId: { type: String, required: true },
        grade: { type: Number },
    }],
    averageRating: { type: Number},
});

module.exports = mongoose.model('Book', bookSchema);