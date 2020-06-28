const express = require('express');

const userchatControllers = require('../controllers/userchat-controllers');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', userchatControllers.addUserchat);
router.get('/userChats', auth, userchatControllers.getChatUsers);

module.exports = router;