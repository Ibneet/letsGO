const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controller')

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post('/login', usersControllers.login);

router.post('/signup',
    [
        check('name')
            .not()
            .isEmpty(), 
        check('email')
            .normalizeEmail()
            .isEmail(),
        check('password')
            .isLength({min: 8})
        
    ],
    usersControllers.signup);

router.patch('/details/:uid',
    [
        check('phone_no')
            .not()
            .isEmpty(), 
        check('gender')
            .not()
            .isEmpty(),
        check('dob')
            .not()
            .isEmpty(),
        check('occupation')
            .not()
            .isEmpty(),
        
    ],
    usersControllers.details);

module.exports = router;