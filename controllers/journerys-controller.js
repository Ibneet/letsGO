const {v4: uuidv4} = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

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

const getCompanion = (req, res, next) => {
    const journeyId = req.params.jid;
    const journeyFrom = req.params.jfrom;
    const journeyTo = req.params.jto;
    const journeyDate = req.params.jdate;
    const journey = DUMMY_JOURNEYS.filter(j => {
        if(j.journey_id !== journeyId){
            if(j.from === journeyFrom){
                if(j.to === journeyTo){
                    if(j.date === journeyDate){
                        if(j.withWhom === null){
                            return true;
                        }
                    }
                }
            }
        }
    })

    if(!journey || journey.length === 0){
        throw new HttpError('No companion found.', 404);
    }

    res.json({journey});
}

const getJournerysHistory = (req, res, next) => {
    const journeyId = req.params.jid;
    const journey = DUMMY_JOURNEYS.find(j => {
        if(j.journey_id === journeyId){
            if(j.withWhom !== null){
                return true;
            }
        }
    })

    if(!journey){
        return next(
            new HttpError('No journey added yet.', 404)
        );
    }

    res.json({journey});
}

const getCurrentJourneys = (req, res, next) => {
    const journeyId = req.params.jid;
    const journey = DUMMY_JOURNEYS.find(j => {
        if(j.journey_id === journeyId){
            if(j.withWhom === null){
                return true;
            }
        }
    })

    if(!journey){
        return next(
            new HttpError('No active journey schedule.', 404)
        );
    }

    res.json({journey});
}

const addJourney = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed', 422);
    }

    const { from, to, date, time } = req.body;
    const addedJourney = {
        journey_id: uuidv4(),
        from,
        to,
        date,
        time,
        withWhom: null
    };

    DUMMY_JOURNEYS.push(addedJourney);
    res.status(201).json({journey: addedJourney});
}

const updateJourney = (req, res, next) => {
    const { from, to, date, time } = req.body;
    const journeyId = req.params.jid;

    const updatedJourney = { ...DUMMY_JOURNEYS.find(j => j.journey_id === journeyId)};
    const journeyIndex = DUMMY_JOURNEYS.findIndex(j => j.journey_id === journeyId);
    updatedJourney.from = from?from:updatedJourney.from;
    updatedJourney.to = to?to:updatedJourney.to;
    updatedJourney.date = date?date:updatedJourney.date;
    updatedJourney.time = time?time:updatedJourney.time;

    DUMMY_JOURNEYS[journeyIndex] = {...DUMMY_JOURNEYS[journeyIndex],...updatedJourney};
    res.status(200).json({journey: updatedJourney});
}

const journeyDone = (req, res, next) => {
    const journeyId = req.params.jid;
    const companion = req.params.uid;

    const journeyCompleted = { ...DUMMY_JOURNEYS.find(j => j.journey_id === journeyId)};
    const journeyIndex = DUMMY_JOURNEYS.findIndex(j => j.journey_id === journeyId);
    journeyCompleted.withWhom = companion;

    DUMMY_JOURNEYS[journeyIndex] = {...DUMMY_JOURNEYS[journeyIndex],...journeyCompleted};
    res.status(200).json({journey: journeyCompleted});
}

const notDoneYet = (req, res, next) => {
    const journeyId = req.params.jid;

    const journeyNotCompleted = { ...DUMMY_JOURNEYS.find(j => j.journey_id === journeyId)};
    const journeyIndex = DUMMY_JOURNEYS.findIndex(j => j.journey_id === journeyId);
    journeyNotCompleted.withWhom = null;

    DUMMY_JOURNEYS[journeyIndex] = {...DUMMY_JOURNEYS[journeyIndex],...journeyNotCompleted};
    res.status(200).json({journey: journeyNotCompleted});
}

const deleteJourney = (req, res, next) => {
    const journeyId = req.params.jid;
    DUMMY_JOURNEYS = DUMMY_JOURNEYS.filter(j => j.journey_id !== journeyId);
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