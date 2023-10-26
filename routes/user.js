const express = require('express');

const router = express.Router();

const usersController = require('../controllers/user');

router.get('/get-all', usersController.getUsers);

router.post('/get-user', usersController.getUser);

router.post('/post-users', usersController.createUser);

router.post('/post-edit-user', usersController.postEditUser);

router.post('/delete-user', usersController.postDeleteUser);


module.exports = router;