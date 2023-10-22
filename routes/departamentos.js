const express = require('express');

const router = express.Router();

const departamentosController = require('../controllers/departamentos');

router.get('/get-all', departamentosController.getDepartamento);

router.post('/post-departamento', departamentosController.createDepartamento);

router.get('/get-hola', departamentosController.getHola);


module.exports = router;