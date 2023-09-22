const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const activesController = require('../controllers/actives');

router.get('/actives', activesController.getActives);

router.post('/actives/create-tipo', activesController.saveAllTipoActivos);

router.post('/post-actives', activesController.createActives);

module.exports = router;