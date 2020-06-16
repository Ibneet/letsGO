const jwt = require('jsonwebtoken');

const User = require('../models/user');
const HttpError = require('../models/http-error');

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisisletsgo');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if(!user){
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    }catch(err){
        const error = new HttpError(
            'Please authenticate.',
            401
        );
        return next(error); 
    }
}

module.exports = auth;