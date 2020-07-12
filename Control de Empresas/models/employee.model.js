'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeSchema = Schema({
    name: String,
    lastname: String,
    role: String,
    departament: String,
    phone: Number,
    email: String,
    company: [{type: Schema.Types.ObjectId, ref:'company'}]
})

module.exports = mongoose.model('employee', employeeSchema);