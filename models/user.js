const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    phone_number: { type: Number, unique: true },
    gender: { type: String, default: null },
    dob: { type: Date, default: null },
    occupation: { type: String, default: null },
    image: { type: String, default: null },
    journeys: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Journey' }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);