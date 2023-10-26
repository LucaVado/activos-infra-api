const express = require('express');

const router = express.Router();

const tiposActivoController = require('../controllers/tipo-activo');

router.get('/get-tipo', tiposActivoController.getTipos);

router.post('/create-tipos', tiposActivoController.saveAllTipoActivos);

router.post('/post-tipo', tiposActivoController.createTipo);

module.exports = router;