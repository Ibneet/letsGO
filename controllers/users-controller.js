const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Journey = require('../models/journey');
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

    const { phone_number, gender, dob, occupation, password } = req.body;

    let user;
    try{
        user = req.user;
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
    user.password = password

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

const logout = async (req, res, next) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();

        res.status(200).json({message: 'Logged out'});
    }catch(err){
        const error = new HttpError(
            'Can not perform the logout function, please try again later.',
            500
        );
        return next(error);
    }
}

const logoutAll = async (req, res, next) => {
    try{
        req.user.tokens = []
        await req.user.save();

        res.status(200).json({message: 'Logged out of all the sessions'});
    }catch(err){
        const error = new HttpError(
            'Can not perform the logout function, please try again later.',
            500
        );
        return next(error);
    }
}

const deleteProfile = async (req, res, next) => {
    try{
        await req.user.remove();
        res.status(200).json({message: 'Account deleted.'});
    }catch(err){
        const error = new HttpError(
            'Can not delete your account, please try again later.',
            500
        );
        return next(error);
    }
}

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
exports.details = details;
exports.logout = logout;
exports.logoutAll = logoutAll;
exports.deleteProfile = deleteProfile;