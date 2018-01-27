var express = require('express');
var router = express.Router();
var auth = require('./auth');
var restful = require('node-restful');
var mongoose = restful.mongoose;
var collections = {};
var models = ['sheets', 'users', 'sites'];

for (var i = 0; i < models.length; i++) collections[models[i]] = require('../models/' + models[i]);

router.get('/',function(req, res) {
  res.json({message: 'Api working!'});
});

collections.users.methods(['get', 'put', 'post', 'delete']);
collections.users.register(router, 'users');




module.exports = router;
