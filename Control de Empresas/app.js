'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var companyRoutes = require('./routes/company.route');
var employeeRoutes = require('./routes/employee.route');
var branchRoutes = require('./routes/branch.route');
var productRoutes = require('./routes/product.route');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/company', companyRoutes);
app.use('/employee',employeeRoutes);
app.use('/branch', branchRoutes);
app.use('/product', productRoutes);

module.exports = app;