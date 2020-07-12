'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var branchSchema = Schema({
    name: String,
    phone: Number,
    address: String,
    company: [{type: Schema.Types.ObjectId, ref: 'company'}],
    products: [{
        _id: String,
        name: String,
        stock: Number,
    }]
})

module.exports = mongoose.model('office', branchSchema);