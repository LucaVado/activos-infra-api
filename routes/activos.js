const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const activosController = require('../controllers/activos');

router.get('/get-all', activosController.getActivos);

router.get('/get-all-tipo', activosController.getActivosByTipo);

router.get('/get-all-estatus', activosController.getActivosByEstatus);

router.get('/get-all-proyecto', activosController.getActivosByProyecto);

router.post('/get-activo', activosController.getActivo);

// router.post('/create-tipo', activosController.saveAllTipoActivos);

router.post('/post-activo', activosController.createActivo);

router.post('/post-edit-activo', activosController.postEditActivo);

router.post('/delete-activo', activosController.postDeleteActivo);

module.exports = router;