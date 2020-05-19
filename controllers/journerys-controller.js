const HttpError = require('../models/http-error');

const DUMMY_JOURNEYS = [
    {
        user_id: 'Ibneet',  //user who added this journey.
        from: 'Jalandhar',
        to: 'Patiala',
        date: '2020-05-2',
        time: '8:00P.M.',
        withWhom: null
    },
    {
        user_id: 'Ibneet',  //user who added this journey.
        from: 'Jalandhar',
        to: 'Patiala',
        date: '2020-05-2',
        time: '8:00P.M.',
        withWhom: 'Rupali'
    }
];

const getCompanion = (req, res, next) => {
    const journeyUser = req.params.uid;
    const journeyFrom = req.params.jfrom;
    const journeyTo = req.params.jto;
    const journeyDate = req.params.jdate;
    const journey = DUMMY_JOURNEYS.find(j => {
        if(j.user_id !== journeyUser){
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
    const journeyUser = req.params.uid;
    const journey = DUMMY_JOURNEYS.find(j => {
        if(j.user_id === journeyUser){
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
    const journeyUser = req.params.uid;
    const journey = DUMMY_JOURNEYS.find(j => {
        if(j.user_id === journeyUser){
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

exports.getCompanion = getCompanion;
exports.getJournerysHistory = getJournerysHistory;
exports.getCurrentJourneys = getCurrentJourneys;