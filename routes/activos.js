const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const activosController = require('../controllers/activos');

router.get('/get-all', activosController.getActivos);

// router.post('/create-tipo', activosController.saveAllTipoActivos);

router.post('/post-activo', activosController.createActivo);

module.exports = router;