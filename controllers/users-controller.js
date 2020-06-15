const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
// require('dotenv').config;

const getUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find({}, '-password');
    }catch(err){
        const error = new HttpError(
            'Could not retrieve the users.',
            500
        );
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({ getters: true }))});
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser
    try{
        existingUser = await User.findOne({ email: email })
    }catch(err){
        const error = new HttpError(
            'Logging in failed, please try again later',
            500
        );
        return next(error);
    }

    if(!existingUser || existingUser.password !== password){
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }

    let token;
    try{
        token = await existingUser.generateAuthToken();
    }catch(err){
        const error = new HttpError(
            'Can not generate a token, please try again later.',
            404
        );
        return next(error);
    }

    res.json({ existingUser, token});
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(
            new HttpError(
                'Invalid inputs passed', 
                422
            )
        ) 
    }

    const {name, email, password, phone_number} = req.body;

    let existingUser
    try{
        existingUser = await User.findOne({ email: email })
    }catch(err){
        const error = new HttpError(
            'Signing up failed, please try again later',
            500
        );
        return next(error);
    }
    
    if(existingUser){
        const error = new HttpError(
            'User already exist, please login instead',
            422
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password,
        phone_number,
        journeys: []
    });

    try{
        await createdUser.save();
    }catch(err){
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    let token;
    try{
        token = await createdUser.generateAuthToken();
    }catch(err){
        const error = new HttpError(
            'Can not generate a token, please try again later.',
            404
        );
        return next(error);
    }

    res.status(201).json({createdUser, token});
}

const details = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed', 422);
    }

    const { phone_number, gender, dob, occupation } = req.body;
    const userId = req.params.uid;

    let user;
    try{
        user = await User.findById(userId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not add your details.',
            500
        );
        return next(error);
    }

    user.image = 'https://i.pinimg.com/736x/de/b4/62/deb4626e2817b49c85bc9a64efa54694.jpg';
    user.phone_number = phone_number;
    user.gender = gender;
    user.dob = dob;
    user.occupation = occupation;

    try{
        await user.save();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not add your details.',
            500
        );
        return next(error);
    }

    res.status(200).json({user: user.toObject({ getters: true })});
}

// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if(token == null) return res.sendStatus(401);

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, 
//         (err, existingUser) => {
//             if(err) return res.sendStatus(403);
//             req.currentUser = existingUser;
//             next();
//         }
//     );
// }

// function generateAccessToken(currentUser){
//     return jwt.sign(currentUser, process.env.ACCESS_TOKEN_SECRET, 
//         { expiresIn: '20d' }
//     );
// }

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
exports.details = details;
// exports.authenticateToken = authenticateToken;