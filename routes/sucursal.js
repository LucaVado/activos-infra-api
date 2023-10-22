const express = require('express');

const router = express.Router();

const sucursalController = require('../controllers/sucursal');

router.get('/get-all', sucursalController.getSucursales);

router.post('/get-sucursal', sucursalController.getSucursal);

router.post('/post-sucursal', sucursalController.createSucursal);

router.post('/post-edit-sucursal', sucursalController.postEditSucursal);

router.post('/delete-sucursal', sucursalController.postDeleteSucursal);


module.exports = router;