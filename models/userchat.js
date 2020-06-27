const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userchatSchema = new Schema({
    from: { type:/*Schema.Types.ObjectId*/ String, required: true },
    to: { type: /*Schema.Types.ObjectId*/ String, },
    chatID: { type: String, required: true },
});

module.exports = mongoose.model('UserChat', userchatSchema);

// module.exports = { Chat };