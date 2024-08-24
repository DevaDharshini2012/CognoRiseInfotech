const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    username: { type: String, required: true },
    category: { type: String, required: true },
    score: { type: Number, required: true }
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
