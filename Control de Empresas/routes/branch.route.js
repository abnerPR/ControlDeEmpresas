'use strict'

var express = require('express');
var branchController = require('../controllers/branch.controller');
var api = express.Router();
var mdAuth = require('../middlewares/authentiticated');


//BRANCH
api.post('/saveBranch', mdAuth.ensureAuth, branchController.saveBranch);
api.put('/updateBranch/:idC/:idB', mdAuth.ensureAuth, branchController.updateBranch);
api.delete('/removeBranch/:idC/:idB', mdAuth.ensureAuth, branchController.removeBranch);
api.get('/listBranch/:id', mdAuth.ensureAuth, branchController.listBranch);
api.put('/setProduct/:id', mdAuth.ensureAuth, branchController.setProduct);
module.exports = api;
