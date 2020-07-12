'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_super_secreta_12345';

exports.createToken = (company)=>{
    var payload = {
        sub: company._id,
        name: company.name,
        address: company.address,
        phone: company.phone,
        email: company.email,
        username: company.username,
        password: company.password,
        iat: moment().unix(),
        exp: moment().add(15, "minutes").unix()
    }
    return jwt.encode(payload, key);
}


