'use strict'

var express = require('express');
var employeeController = require('../controllers/employee.controller');
var api = express.Router();

//EMPLOYEE
api.post('/saveEmployee', employeeController.saveEmployee);
api.put('/updateEmployee/:id', employeeController.updateEmployee);
api.delete('/removeEmployee/:id', employeeController.removeEmployee);
api.get('/countEmployee/:id', employeeController.countEmployee);
api.post('/searchEmployee', employeeController.searchEmployee);
api.get('/generateExcel', employeeController.generateExcel);

module.exports = api;