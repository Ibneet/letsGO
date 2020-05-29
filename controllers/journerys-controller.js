const {v4: uuidv4} = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Journey = require('../models/journey');

let DUMMY_JOURNEYS = [
    {
        journey_id: 'j1',  //user who added this journey.
        from: 'Jalandhar',
        to: 'Patiala',
        date: '2020-05-2',
        time: '8:00P.M.',
        withWhom: null
    },
    {
        journey_id: 'j2',  //user who added this journey.
        from: 'Jalandhar',
        to: 'Patiala',
        date: '2020-05-2',
        time: '8:00P.M.',
        withWhom: 'u1'
    }
];

const getCompanion = async (req, res, next) => {
    const journeyUser = req.params.uid;
    const journeyFrom = req.params.jfrom;
    const journeyTo = req.params.jto;
    const journeyDate = req.params.jdate;
    let journey;
    try{
        journey = await Journey.find(
            { 
                creator: {$ne: journeyUser}, 
                from: journeyFrom, 
                to: journeyTo, 
                date: journeyDate, 
                withWhom: null 
            }
        ).collation({ locale: 'en', strength: 2 });
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find the companion.',
            500
        );
        return next(error);
    }
    
    if(!journey || journey.length === 0){
        const error = new HttpError(
            'No companion found.', 
            404
        );
        return next(error);
    }

    res.json({journey: journey.map(journey => journey.toObject({ getters: true }))});
}

const getJournerysHistory = async (req, res, next) => {
    const journeyUser = req.params.uid;

    let journey;
    try{
        journey = await Journey.find({creator: journeyUser, withWhom: {$ne: null}});
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find the journey.',
            500
        );
        return next(error);
    }
    if(!journey || journey.length === 0){
        const error = new HttpError(
                'No journey added yet.', 
                404
            );
        return next(error);
    }

    res.json({journey: journey.map(journey => journey.toObject({ getters: true }))});
}

const getCurrentJourneys = async (req, res, next) => {
    const journeyUser = req.params.uid;

    let journey;
    try{
        journey = await Journey.find({creator: journeyUser, withWhom: null});
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not find the journey.', 
            500
        );
        return next(error);
    }

    if(!journey || journey.length === 0){
        const error = new HttpError(
                'No active journey schedule.', 
                404
            );
        return next(error);
    }

    res.json({journey: journey.map(journey => journey.toObject({ getters: true }))});
}

const addJourney = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError(
            'Invalid inputs passed', 
            422
        );
    }

    const { from, to, date, creator } = req.body;
    const addedJourney = new Journey({
        from,
        to,
        date,
        creator
    });

    try{
        await addedJourney.save();
    }catch(err){
        const error = new HttpError(
            'Failed to add this journey, please try again.',
            500
        );
        return next(error);
    }
    
    res.status(201).json({journey: addedJourney});
}

const updateJourney = async (req, res, next) => {
    const { from, to, date } = req.body;
    const journeyId = req.params.jid;

    let journey;
    try{
        journey = await Journey.findById(journeyId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update journey',
            500
        );
        return next(error);
    }

    journey.from = from?from:journey.from;
    journey.to = to?to:journey.to;
    journey.date = date?date:journey.date;

    try{
        await journey.save();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update journey.',
            500
        );
        return next(error);
    }

    res.status(200).json({journey: journey.toObject({ getters: true })});
}

const journeyDone = async (req, res, next) => {
    const journeyId = req.params.jid;
    const companion = req.params.uid;

    let journey 
    try{
        journey = await Journey.findById(journeyId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update this journey as done.',
            500
        )
        return next(error);
    }
    journey.withWhom = companion;

    try{
        await journey.save();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update this journey as done.',
            500
        );
        return next(error);
    }

    res.status(200).json({journey: journey.toObject({ getters: true })});
}

const notDoneYet = async (req, res, next) => {
    const journeyId = req.params.jid;

    let journey;
    try{
        journey = await Journey.findById(journeyId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update this journey as not done.',
            500
        )
        return next(error);
    }
    journey.withWhom = null;

    try{
        await journey.save();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update this journey as not done.',
            500
        );
        return next(error);
    }

    res.status(200).json({journey: journey.toObject({ getters: true })});
}

const deleteJourney = async (req, res, next) => {
    const journeyId = req.params.jid;
    
    let journey;
    try{
        journey = await Journey.findById(journeyId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete this journey.',
            500
        );
        return next(error);
    }

    try{
        await journey.remove();
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete this journey.',
            500
        );
        return next(error);
    }

    res.status(200).json({message: 'Deleted a journey.'});
}

exports.getCompanion = getCompanion;
exports.getJournerysHistory = getJournerysHistory;
exports.getCurrentJourneys = getCurrentJourneys;
exports.addJourney = addJourney;
exports.updateJourney = updateJourney;
exports.journeyDone = journeyDone;
exports.notDoneYet = notDoneYet;
exports.deleteJourney = deleteJourney;