'use strict'

var Branch = require('../models/branch.model');
var Product = require('../models/product.model');

function saveBranch(req, res){
    var branch = new Branch();
    var params = req.body;

    if(params.company != req.company.sub){
      res.status(403).send({message: 'Error de permisos para esta ruta'})  
    }else{
        if(params.name && params.phone && params.address){
            Branch.findOne({$or:[{name: params.name}, {phone: params.phone}]}, (err, branchOk)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(branchOk){
                    res.send({message: 'nombre o telefono en uso'});
                }else{
                    branch.name = params.name;
                    branch.phone = params.phone;
                    branch.address = params.address;
                    branch.company = params.company;
                    branch.product = params.product;
                    branch.cantidad = params.cantidad;
    
                    branch.save((err, branchSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(branchSaved){
                            res.send({message: 'Guardado exitoso', branch: branchSaved});
                        }else{
                            res.status(404).send({message: 'Guardado fallido'})
                        }
                    })
                }
            })
        }else{
            res.send({message: 'Faltan campos necesarios'})
        }
    }
}
 
function updateBranch(req, res){
    var companyId = req.params.idC;
    var branchId = req.params.idB;
    var update = req.body;

    if(companyId != req.company.sub){
        res.status(403).send({message: 'Error de permisos para esta ruta'});
    }else{
        Branch.findByIdAndUpdate(branchId, update, {new: true}, (err, branchUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(branchUpdated){
                res.send({message: 'Actualizacón éxitosa', branch: branchUpdated});
            }else{
                res.status(404).send({message: 'Actualización fallida'})
            }
        })
    }
}

function removeBranch(req, res){
    var companyId = req.params.idC;
    var branchId = req.params.idB;

    if(companyId != req.company.sub){
        res.status(403).send({message: 'Error de permisos para esta ruta'});
    }else{
        Branch.findByIdAndRemove(branchId, (err, branchRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(branchRemoved){
                res.send({message: 'Eliminación correcta', branch: branchRemoved});
            }else{
                res.status(404).send({message: 'Eliminación fallida'});
            }
        })
    }
}

function listBranch(req, res){
    var companyId = req.params.id;

    if(companyId != req.company.sub){
        res.status(403).send({message: 'Error de permisos para esta ruta'});
    }else{
        Branch.find({company: companyId}, (err, branchFind)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(branchFind){
                res.send({branch: branchFind});
            }else{
                res.status(404).send({message: 'Sin datos que mostrar'});
            }
        }).populate('company')
    }
}

function setProduct(req, res){
    var companyId = req.params.id
    var params = req.body;
    var branchId = params.branch;
    var productId = params.id_product;
    var product = new Product();

    if(companyId != req.company.sub){
        res.status(403).send({message: 'Erro de permisos para esta ruta'})
    }else{
        if(params.branch && params.stock){
            Branch.findOne({$or:[{"products.name": params.name}, {"products._id": productId}]}, (err, productFind)=>{
                if(err){
                    res.status(500).send({message: 'Error', err})
                }else if(productFind){
                    res.send({message: 'Producto ya registrado'});
                }else{
                    Product.findOne({_id: productId}, (err, productOk)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(productOk){
                            if(productOk.stock >= params.stock){
                                var stockF = productOk.stock - params.stock;
        
                                Product.findOneAndUpdate({_id: productId}, {stock: stockF}, {new: true}, (err, updated)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error', err})
                                    }else if(updated){
                                        Branch.findById(branchId, (err, branchOk)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error', err});
                                            }else if(branchOk){
                                                    product._id = updated._id;
                                                    product.name = updated.name;
                                                    product.stock = params.stock;
                                    
                                                    Branch.findByIdAndUpdate(branchId, {$push:{products: product}}, {new: true}, (err, branchUpdated)=>{
                                                        if(err){
                                                            res.status(500).send({message: 'Error', err});
                                                        }else if(branchUpdated){
                                                            res.send({message: 'Producto asignado', branch: branchUpdated});
                                                        }else{
                                                            res.status(418).send({message: 'Error inesperado'});
                                                        }
                                                    })
                                            }else{
                                                res.status(404).send({message: 'No existe la sucursal'})
                                            }
                                        })
                                    }else{
                                        res.status(418).send({message: 'Error inesperado'});
                                    }
                                })
                            }else{
                                res.status(418).send({message: 'producto insuficiente'})
                            }
                        }else{
                            res.status(404).send({message: 'Producto no encontrado'});
                        }
                    })
                }
            })
        }else{
            res.send({message: 'Faltan datos para ingresar'})
        }
    }
}

module.exports = {
    saveBranch,
    updateBranch,
    removeBranch,
    listBranch,
    setProduct
}