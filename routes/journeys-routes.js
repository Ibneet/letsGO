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

router.patch('/:jid', journeysControllers.updateJourney);

router.patch('/:jid/:uid', journeysControllers.journeyDone);

router.patch('/history/notYet/:jid', journeysControllers.notDoneYet);

router.delete('/:jid', journeysControllers.deleteJourney);

module.exports = router;