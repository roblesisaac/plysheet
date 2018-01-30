var express = require('express');
var router = express.Router();
var auth = require('./auth');
var restful = require('node-restful');
var mongoose = restful.mongoose;
var collections = {};
var models = ['sheets', 'users', 'sites'];

for (var i = 0; i < models.length; i++) collections[models[i]] = require('../models/' + models[i]);

router.get('/api',function(req, res) {
  res.json({message: 'Api working!'});
});

collections.users.methods(['get', 'put', 'post', 'delete'])
.before('post', function(req, res, next){
  res.send('working now');
  next();
})
.register(router, '/users');




module.exports = router;
