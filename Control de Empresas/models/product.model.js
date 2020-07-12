'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    name: String,
    stock: Number,
    price: String,
    company: [{type: Schema.Types.ObjectId, ref:'company'}]
});

module.exports = mongoose.model('product', productSchema);
