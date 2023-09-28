const express = require('express');

const router = express.Router();

const proyectosController = require('../controllers/proyectos');

router.get('/get-all', proyectosController.getProyectos);

router.post('/post-proyecto', proyectosController.createProyecto);


module.exports = router;