const express = require('express');

const router = express.Router();

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

router.get('/:uid/:jfrom/:jto/:jdate', (req, res, next) => {
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
    res.json({journey});
})

router.get('/history/:uid', (req, res, next) => {
    const journeyUser = req.params.uid;
    const journey = DUMMY_JOURNEYS.find(j => {
        if(j.user_id === journeyUser){
            if(j.withWhom !== null){
                return true;
            }
        }
    })
    res.json({journey});
})

router.get('/current/:uid', (req, res, next) => {
    const journeyUser = req.params.uid;
    const journey = DUMMY_JOURNEYS.find(j => {
        if(j.user_id === journeyUser){
            if(j.withWhom === null){
                return true;
            }
        }
    })
    res.json({journey});
})

module.exports = router;