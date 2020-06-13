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
            .isLength({min: 6})
        
    ],
    usersControllers.signup);

router.put('/details/:uid',
    [
        check('phone_number')
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