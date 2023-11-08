const express = require('express');

const router = express.Router();

const tiposActivoController = require('../controllers/tipo-activo');

router.get('/get-all', tiposActivoController.getTipos);

router.get('/get-codigo', tiposActivoController.getTipoByCode);

router.post('/create-tipos', tiposActivoController.saveAllTipoActivos);

router.post('/post-tipo', tiposActivoController.createTipo);

router.post('/delete-tipo', tiposActivoController.postDeleteTipo);

module.exports = router;