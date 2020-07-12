'use strict'

var Product = require('../models/product.model');
var Branch = require('../models/branch.model');

function saveProduct(req, res){
    var product = new Product();
    var params = req.body;

    if(params.company != req.company.sub){
        req.status(403).send({message: 'No tiene permisos para esta ruta'});
    }else{
        if(params.name && params.stock && params.price){
            Product.findOne({name: params.name},  (err, productOk)=>{
                if(err){
                    res.status(500).send({message: 'Error general', err});
                }else if(productOk){
                    res.send({message: 'producto ya registrado'});
                }else{
                    product.name = params.name;
                    product.stock = params.stock;
                    product.price = params.price;
                    product.company = params.company;
    
                    product.save((err, productSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(productSaved){
                            res.send({message: 'Creación de producto éxitoso', product: productSaved})
                        }else{
                            res.status(418).send({message: 'Creación de producto fallida'});
                        }
                    })
                }
            })
        }else{
            res.send({message: 'Datos insuficientes'})
        }
    }
}

function updateProduct(req, res){
    var companyId = req.params.idC;
    var productId = req.params.idP;
    var update = req.body;

    if(companyId != req.company.sub){
        res.status(403).send({message: 'Error de permisos para esta ruta'});   
    }else{
        Product.findByIdAndUpdate(productId, update, {new: true}, (err, updateProduct)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(updateProduct){
                if(update.name){
                    Branch.findOneAndUpdate({"products._id": productId}, {"products.$.name": update.name}, (err, nameUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(nameUpdated){
                            res.send({message: 'Actualizacion exitosa', product: updateProduct})
                        }else{
                            res.status(418).send({message: 'Error inesperado'});
                        }
                    })
                }else{ 
                    res.send({message: 'Actualizacion exitosa', product: updateProduct});
                }
            }else{
                res.status(418).send({message: 'Error inesperado'});
            }
        })
    }

}

function removeProduct(req, res){
    var companyId = req.params.idC;
    var productId = req.params.idP;

    if(companyId != req.company.sub){
        res.status(403).send({message: 'Error de permisos para esta ruta'});
    }else{
        Product.findByIdAndRemove(productId, (err, productRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error', err});
            }else if(productRemoved){
                res.send({message: 'Eliminacion exitosa', product: productRemoved});
            }else{
                res.status(418).send({message: 'error inesperado al eliminar'})
            }
        })
    }
}

function listProducts(req, res){
    var companyId = req.params.idC;
    
        if(companyId != req.company.sub){
            res.status(403).send({message: 'Error de permisos para esta ruta'});
        }else{
            Product.find({company: companyId}, (err, productFind)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(productFind){
                    res.send({product: productFind});
                }else{
                    res.status(404).send({message: 'Sin datos que mostrar'});
                }
            }).populate('company')
        }
    }

function searchProducts(req, res){
    var companyId = req.params.idC;
    var params = req.body;
    if(companyId != req.company.sub){
        req.status(403).send({message: 'Error de permisos para esta ruta'});
    }else{
        if(params.search){
            Product.find({name: params.search}, (err, productFind)=>{
                if(err){
                    res.status(500).send({message: 'Error', err});
                }else if(productFind){
                    Branch.find({"products.name": params.search}, (err, productFind2)=>{
                        if(err){
                            res.status(500).send({message: 'Error', err});
                        }else if(productFind2){   
                            res.send({product_Company: productFind, product_branch: productFind2});
                        }else{
                            res.status(404).send({message: 'Sin datos que mostrar'});
                        }
                    })
                }else{
                    res.status(404).send({message: 'Sin datos que mostrar'});
                }
            }).populate('company');
    }
}
}

module.exports = {
    saveProduct,
    updateProduct,
    removeProduct,
    listProducts,
    searchProducts
}