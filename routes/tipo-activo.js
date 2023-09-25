const express = require('express');

const router = express.Router();

const tiposActivoController = require('../controllers/tipo-activo');

router.get('/get-tipo', tiposActivoController.getTipos);

router.post('/create-tipo', tiposActivoController.saveAllTipoActivos);

module.exports = router;