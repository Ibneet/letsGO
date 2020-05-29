const express = require('express');
const { check } = require('express-validator');

const journeysControllers = require('../controllers/journerys-controller')

const router = express.Router();

router.get('/:uid/:jfrom/:jto/:jdate', journeysControllers.getCompanion);

router.get('/history/:uid', journeysControllers.getJournerysHistory);

router.get('/current/:uid', journeysControllers.getCurrentJourneys);

router.post(
    '/',
    [
        check('from')
            .not()
            .isEmpty(), 
        check('to')
            .not()
            .isEmpty(),
        
    ],
    journeysControllers.addJourney
);

router.put('/:jid', journeysControllers.updateJourney);

router.put('/:jid/:uid', journeysControllers.journeyDone);

router.put('/history/notYet/:jid', journeysControllers.notDoneYet);

router.delete('/:jid', journeysControllers.deleteJourney);

module.exports = router;