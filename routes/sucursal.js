const express = require('express');

const router = express.Router();

const sucursalController = require('../controllers/sucursal');

router.post('/post-sucursal', sucursalController.createSucursal);


module.exports = router;