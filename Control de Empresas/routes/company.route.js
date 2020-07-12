'use strict'

var express = require('express');
var companyController = require('../controllers/company.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authentiticated');


//COMPANY
api.post('/saveCompany', companyController.saveCompany);
api.put('/updateCompany/:id', mdAuth.ensureAuth, companyController.updateCompany);
api.delete('/removeCompany/:id', mdAuth.ensureAuth, companyController.removeCompany);
api.get('/listCompanies', companyController.listCompanies);
api.get('/generateExcel', companyController.generateExcel);
api.post('/loginCompany', companyController.login)

module.exports = api;
