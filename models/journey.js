const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const journeySchema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date, default: Date.now },
    creator: { type: String, required: true },
    withWhom: { type: String, default: null },
});

module.exports = mongoose.model('Journey', journeySchema);