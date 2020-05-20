const {v4: uuidv4} = require('uuid');

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
        withWhom: 'Rupali'
    }
];

const getCompanion = (req, res, next) => {
    const journeyId = req.params.jid;
    const journeyFrom = req.params.jfrom;
    const journeyTo = req.params.jto;
    const journeyDate = req.params.jdate;
    const journey = DUMMY_JOURNEYS.find(j => {
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

    if(!journey){
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
    const { from, to, date, time, withWhom } = req.body;
    const addedJourney = {
        journey_id: uuidv4(),
        from,
        to,
        date,
        time,
        withWhom 
    };

    DUMMY_JOURNEYS.push(addedJourney);
    res.status(201).json({journey: addedJourney});
}

const updateJourney = (req, res, next) => {
    const { from, to, date, time } = req.body;
    const journeyId = req.params.jid;

    const updatedJourney = { ...DUMMY_JOURNEYS.find(j => j.journey_id === journeyId)};
    const journeyIndex = DUMMY_JOURNEYS.findIndex(j => j.journey_id === journeyId);
    updatedJourney.from = from;
    updatedJourney.to = to;
    updatedJourney.date = date;
    updatedJourney.time = time;

    DUMMY_JOURNEYS[journeyIndex] = updatedJourney;
    res.status(200).json({journey: updatedJourney});
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
exports.deleteJourney = deleteJourney;