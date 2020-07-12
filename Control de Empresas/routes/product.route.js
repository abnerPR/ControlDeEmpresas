'use strict'

var express = require('express');
var productController = require('../controllers/product.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authentiticated');


api.post('/saveProduct', mdAuth.ensureAuth, productController.saveProduct);
api.put('/updateProduct/:idC/:idP', mdAuth.ensureAuth, productController.updateProduct);
api.post('/searchProducts/:idC', mdAuth.ensureAuth, productController.searchProducts);
api.get('/listProducts/:idC', mdAuth.ensureAuth, productController.listProducts);
api.delete('/removeProduct/:idC/:idP', mdAuth.ensureAuth, productController.removeProduct);

module.exports = api;
