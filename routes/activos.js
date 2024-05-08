const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const activosController = require('../controllers/activos');

router.get("/buscar/:busqueda", activosController.buscarActivos);

router.get('/get-all', activosController.getActivos);

router.get('/get-all-tipo', activosController.getActivosByTipo);

router.get('/get-all-estatus', activosController.getActivosByEstatus);

router.get('/get-all-proyecto', activosController.getActivosByProyecto);

router.post('/edit-numero-serie-recibido', activosController.changeEstatusByNumeroSerie);

router.post('/get-activo', activosController.getActivo);

// router.post('/create-tipo', activosController.saveAllTipoActivos);

router.post('/post-activo', activosController.createActivo);

router.post('/post-edit-activo', activosController.postEditActivo);

router.post('/delete-activo', activosController.postDeleteActivo);

router.get('/generar-reporte-activos-excel', activosController.generarReporteActivosProyectoExcel);

module.exports = router;