'use strict'

var Company = require('../models/company.model');
var xlsx = require('mongo-xlsx');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

function saveCompany(req, res){    
    var company = new Company();
    var params = req.body;

    if(params.name &&
       params.address &&
       params.phone &&
       params.email && params.username){
           Company.findOne({$or:[{name: params.name}, {email: params.email}, {username: params.username}]},(err, companyOk)=>{
               if(err){
                res.status(500).send({message: 'Error', err});
               }if(companyOk){
                res.send({message: 'nombre o correo o usuario en uso'});
               }else{
                company.name = params.name;
                company.address = params.address;
                company.phone = params.phone;
                company.email = params.email;
                company.username = params.username;
    
                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        res.status(500).send({message: 'Error al encriptar contraseña'});
                    }else if(passwordHash){
                        company.password = passwordHash;
                        
                        company.save((err, companySaved)=>{
                            if(err){
                                res.status(500).send({message: 'Error', err});
                            }else if(companySaved){
                                res.send({message: 'Guardado correctamente', company: companySaved});
                            }else{
                                res.status(418).send({message: 'Guardado fallido', err});
                            }
                        });
                    }else {
                        res.status(404).send({message: 'Error inesperado'});
                    }
                });
               }
           }); 
       }else{
           res.send({message: 'Faltan campos necesarios'});
       }
}

function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
            Company.findOne({$or:[{username: params.username},
                                  {email: params.email}]}, (err, check)=>{
                                      if(err){
                                        res.status(500).send({message: 'Error general', err});
                                      }else if(check){
                                        bcrypt.compare(params.password, check.password, (err, passwordOk)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error al comparar'});
                                            }else if(passwordOk){
                                                if(params.gettoken = true){
                                                    res.send({token: jwt.createToken(check)});
                                                }else{
                                                    res.send({message: 'Bienvenido', company: check});
                                                }
                                            }else{
                                                res.send({message: 'Contraseña incorrecta'});
                                            }
                                        });
                                      }else{
                                          res.send({message: 'Datos de usuario incorrectos'});
                                      }
                                  });
        }else{
            res.send({message: 'Ingresa tu contraseña'});
        }
    }else{
        res.send({message: 'Ingresa tu correo o tu usuario'});
    }
}

function  updateCompany(req, res){
    let companyId = req.params.id;
    var update = req.body;

    if(companyId != req.company.sub){
        res.status(403).send({message: 'Error de permisos para esta ruta'});
    }else{
    Company.findByIdAndUpdate(companyId, update, {new: true}, (err, companyUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error', err});
        }else if(companyUpdated){
            res.send({message: 'Actualización exitosa', company: companyUpdated});
        }else{
            res.status(404).send({message: 'Actualizacion fallida'})
        }
    })
}
}


function removeCompany(req, res){
    let companyId = req.params.id;

    if(companyId != req.company.sub){
        res.status(403).send({message: 'Error de permisos para esta ruta'});
    }else{
        Company.findByIdAndRemove(companyId, (err, companyRemoved)=>{
            if(err){
                res.status(500).send({message: 'error', err});
            }else if(companyRemoved){
                res.send({message: 'Eliminacion correcta', company: companyRemoved});
            }else{
                res.status(404).send({message: 'Eliminacion fallida', company: companyRemoved});
            }
        })
    }
}

function listCompanies(req, res){
    Company.find((err, companies)=>{
        if(err){
            res.status(500).send({message: 'Error', err});
        }else if(companies){
            res.send({companies: companies});
        }else{
            res.status(404).send({message: 'Sin compañias que mostrar'});
        }
    })
}

function generateExcel(req, res){
    Company.find({}, (err, excel)=>{
        if(err){
            res.status(500).send({message: 'Error', err});
        }else if(excel){
            var model = xlsx.buildDynamicModel(excel);

            xlsx.mongoData2Xlsx(excel, model, (err, excelOk)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(excelOk){
                    res.send({message: 'Excel Exitoso'});
                }else{
                    res.status(418).send({message: 'error al generar el excel', err})
                }
            })
        }else{
            res.status(404).send({message: 'Sin datos para generar el excel'})
        }
    })
}

module.exports = {
    saveCompany,
    updateCompany,
    removeCompany,
    listCompanies,
    generateExcel,
    login
}