const {v4: uuidv4} = require('uuid');
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        user_id: 'u1',
        name: 'Ibneet Kaur',
        email: 'wow@gmail.com',
        password: 'password',
        phone_no: '242413',
        gender: 'female',
        dob: '1999-06-06',
        occupation: 'student',
        
    }
]

const getUsers = (req, res, next) => {
    res.json({ users: DUMMY_USERS });
}

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError('Could not identify user, check the credentials', 401);
    }
    
    res.json({ message: 'Logged in!' });
}

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed', 422);
    }

    const {name, email, password} = req.body;

    const userExist = DUMMY_USERS.find(u => u.email === email);
    if(userExist){
        throw new HttpError('User already exist.', 422);
    }

    const createdUser = {
        user_id: uuidv4(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);

    res.status(201).json({ user: createdUser });
}

const details = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed', 422);
    }

    const { phone_no, gender, dob, occupation } = req.body;
    const userId = req.params.uid;

    const addedUser = { ...DUMMY_USERS.find = (u => u.user_id === userId)};
    const userIndex = DUMMY_USERS.findIndex(u => u.user_id === userId);
    addedUser.phone_no = phone_no;
    addedUser.gender = gender;
    addedUser.dob = dob;
    addedUser.occupation = occupation;

    DUMMY_USERS[userIndex] = {...DUMMY_USERS[userIndex],...addedUser};
    res.status(200).json({user: addedUser});
}

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
exports.details = details;