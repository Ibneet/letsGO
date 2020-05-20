const express = require('express');

const journeysControllers = require('../controllers/journerys-controller')

const router = express.Router();

router.get('/:jid/:jfrom/:jto/:jdate', journeysControllers.getCompanion);

router.get('/history/:jid', journeysControllers.getJournerysHistory);

router.get('/current/:jid', journeysControllers.getCurrentJourneys);

router.post('/', journeysControllers.addJourney);

router.patch('/:jid', journeysControllers.updateJourney);

router.delete('/:jid', journeysControllers.deleteJourney);

module.exports = router;