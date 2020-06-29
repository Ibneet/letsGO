const express = require('express');
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const journeysControllers = require('../controllers/journerys-controller');

const router = express.Router();

router.get('/:jfrom/:jto/:jdate', auth, journeysControllers.getCompanion);

router.get('/history', auth, journeysControllers.getJournerysHistory);

router.get('/current', auth, journeysControllers.getCurrentJourneys);

router.post(
    '/',
    auth,
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

router.patch('/:jid', auth, journeysControllers.updateJourney);

// router.patch('/:jid/:uid', auth, journeysControllers.journeyDone);

// router.patch('/history/notYet/:jid', auth, journeysControllers.notDoneYet);

router.delete('/:jid', auth, journeysControllers.deleteJourney);

module.exports = router;