'use strict'

var Employee = require('../models/employee.model');
var xlsx = require('mongo-xlsx');

function saveEmployee(req, res){
    var employee = new Employee();
    var params = req.body;

    if(params.name && params.lastname &&
       params.role && params.departament &&
       params.phone && params.email){

            Employee.findOne({$or:[{email: params.email}, {phone: params.phone}]}, (err, employeeOk)=>{
              if(err){
                res.status(500).send({message: 'Error', err});
              }else if(employeeOk){
                res.send({message: 'correo o telefono en uso'});
              }else{
                employee.name = params.name;
                employee.lastname = params.lastname;
                employee.role = params.role;
                employee.departament = params.departament;
                employee.phone = params.phone;
                employee.email = params.email;
                employee.company = params.company;

                employee.save((err, employeeSaved)=>{
                    if(err){
                        res.status(500).send({message: 'Error', err})
                    }else if(employeeSaved){
                        res.send({message: 'Guardado exitoso', employee:employeeSaved});
                    }else {
                        res.status(418).send({message: 'Error al guardar', err});
                    }
                })
              }
            })
       }
}

function  updateEmployee(req, res){
    let employeeId = req.params.id;
    var update = req.body;

    Employee.findByIdAndUpdate(employeeId, update, {new: true}, (err, employeeUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error', err});
        }else if(employeeUpdated){
            res.send({message: 'Actualización correcta', employee: employeeUpdated});
        }else{
            res.status(404).send({message: 'Actualizacion fallida', err})
        }
    })
}

function removeEmployee(req, res){
    let employeeId = req.params.id;

    Employee.findByIdAndRemove(employeeId, (err, employeeRemoved)=>{
        if(err){
            res.status(500).send({message: 'error', err});
        }else if(employeeRemoved){
            res.send({message: 'Eliminacion correcta', employee: employeeRemoved});
        }else{
            res.status(404).send({message: 'Eliminacion Fallida', employee: employeeRemoved});
        }
    })
}

function countEmployee(req, res){
    var companyId = req.params.id;

    Employee.find({company: companyId}).count((err, countEmployee)=>{
        if(err){
            res.status(500).send({message: 'Error', err})
        }else if(countEmployee){
            res.send({message: 'Total de empleados laborando', countEmployee});
        }else{
            res.status(404).send({message: 'Sin empleados'})
        }
    })
}

function searchEmployee(req, res){
    var params = req.body;
    
    var search = params.search;
        if(params.search == null){
            Employee.find((err, find)=>{
               if(err){
                   res.status(500).send({message: 'Error general', err});
               }else if(find){
                   res.send({employees: find});
               }else{  
                   res.status(404).send({message: 'Empleado(s) no encontrado'});
               }
            })
        }else{
            Employee.find({$or:[
                            {name: {$regex: search, $options: 'i'}},
                            {role: {$regex: search, $options: 'i'}},    
                            {departament: {$regex: search, $options: 'i'}}]}, (err, find)=>{
            if(err){
                res.status(500).send({message: 'Error general', err});
            }else if(find){
                res.send({employee: find});
            }else{
                res.status(404).send({message: 'Empleado(s) no encontrado'});
            }
        })
}
}

function generateExcel(req, res){
    Employee.find({}, (err, excel)=>{
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
    saveEmployee,
    updateEmployee,
    removeEmployee,
    countEmployee,
    searchEmployee,
    generateExcel
}
