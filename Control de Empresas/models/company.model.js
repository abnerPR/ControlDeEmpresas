'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var companySchema = Schema({
    name: String,
    address: String,
    phone: Number,
    email: String,
    username: String,
    password: String
})

module.exports = mongoose.model('company', companySchema);