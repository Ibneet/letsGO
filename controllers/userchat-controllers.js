const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const UserChat = require('../models/userchat');
const User = require('../models/user');


const addUserchat = async (req, res, next) => {
    const { from, to } = req.body;

    const cid = from < to ? from + to : to + from;

    let userchats;
    try {
        userchats = await UserChat.findOne({ chatID: cid });
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
            chatID: cid,
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

const getChatUsers = async (req, res, next) => {
    const loggedInUser = req.user._id;
    let userChats;
    try{
        userChats = await UserChat.find({
            $or: [
                { from: loggedInUser },
                { to: loggedInUser }
            ]
        }
        );
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not retrieve the chats.',
            500
        );
        return next(error);
    }
    
    if(!userChats || userChats.length === 0){
        const error = new HttpError(
            'No chats found.', 
            404
        );
        return next(error);
    }

    var chatUsers = [];
    var chat;
    try{
        for(var index in userChats){
            chat = userChats[index].from == loggedInUser 
            ? await User.findById({_id: userChats[index].to})
            : await User.findById({_id: userChats[index].from})
            chatUsers = chatUsers.concat(chat);
        };
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find the chats.',
            500
        );
        return next(error);
    }

    res.json({chatUsers: chatUsers});
}

exports.addUserchat = addUserchat;
exports.getChatUsers = getChatUsers;