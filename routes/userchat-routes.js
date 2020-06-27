const express = require('express');

const userchatControllers = require('../controllers/userchat-controllers');

const router = express.Router();

router.post('/',userchatControllers.addUserchat);

module.exports = router;