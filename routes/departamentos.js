const express = require('express');

const router = express.Router();

const departamentosController = require('../controllers/departamentos');

router.post('/post-departamento', departamentosController.createDepartamento);


module.exports = router;