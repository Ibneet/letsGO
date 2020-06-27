const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const UserChat = require('../models/userchat');


const addUserchat = async (req, res, next) => {
    const { from, to } = req.body;

    let userchats;
    try {
        userchats = await UserChat.findOne({ from: from, to: to });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the chat.',
            500
        );
        return next(error);
    }

    if (!userchats) {
        userchats = new UserChat({
            from,
            to,
            chatID: from < to ? from + to : to + from,
        });
        try {

            await userchats.save();
        } catch (err) {
            const error = new HttpError(
                'Failed to add this userchats, please try again.',
                500
            );
            return next(error);
        }
    } else {
        // const error = new HttpError(
        //     'No chat yet.',
        //     404
        // );
        // return next(error);
        console.log('userchat already present');
    }
    console.log("userchats added");

    res.json({ userchat: userchats });

    
}

exports.addUserchat = addUserchat;