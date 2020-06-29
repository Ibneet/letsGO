const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const journeySchema = new Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date, default: Date.now },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Journey', journeySchema);