const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Journey = require('./journey');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    phone_number: { type: String, default: null },
    gender: { type: String, default: null },
    dob: { type: Date, default: null },
    occupation: { type: String, default: null },
    image: { type: String, default: null },
    journeys: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Journey' }],
    tokens: [{ token:{type: String, required: true} }]
});

userSchema.plugin(uniqueValidator);

userSchema.methods.generateAuthToken = async function(){
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, 'thisisletsgo');

    user.tokens = user.tokens.concat({ token });
    await user.save()

    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;

    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

userSchema.pre('remove', async function(next) {
    const user = this;

    await Journey.deleteMany({ creator: user._id });
    next();
})

module.exports = mongoose.model('User', userSchema);