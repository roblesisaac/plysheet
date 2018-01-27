var express = require('express');
var router = express.Router();
var auth = require('./auth');
var restful = require('node-restful');
var mongoose = restful.mongoose;
var collections = {};
var models = ['sheets', 'users', 'sites'];

for (var i = 0; i < models.length; i++) collections[models[i]] = require('../models/' + models[i]);





module.exports = router;
