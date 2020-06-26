const express = require('express');
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const usersControllers = require('../controllers/users-controller');

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
    usersControllers.signup
);

router.patch('/details/me',
    auth,
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
    usersControllers.details
);

router.post('/logout', auth, usersControllers.logout);

router.post('/logoutAll', auth, usersControllers.logoutAll);

router.delete('/me', auth, usersControllers.deleteProfile);

module.exports = router;