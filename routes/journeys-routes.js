const express = require('express');

const journeysControllers = require('../controllers/journerys-controller')

const router = express.Router();

router.get('/:uid/:jfrom/:jto/:jdate', journeysControllers.getCompanion);

router.get('/history/:uid', journeysControllers.getJournerysHistory);

router.get('/current/:uid', journeysControllers.getCurrentJourneys);

module.exports = router;