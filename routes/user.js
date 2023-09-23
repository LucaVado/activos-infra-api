const express = require('express');

const router = express.Router();

const usersController = require('../controllers/user');

router.post('/post-users', usersController.createUser);


module.exports = router;