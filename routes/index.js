var express = require('express');
var router = express.Router();
var fs = require('fs');
var tmplts = {};

/* GET tmplts. */
router.get('/', function(req, res, next) {
  fs.readdir('views/partials/', function (err, data) {
    for (i=0; i<data.length; i++) {
      tmplts[data[i].slice(0,-4)] = fs.readFileSync('views/partials/' + data[i], 'utf8');
    } 
    res.end('var tmplts = '+tmplts);
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express'
  });
});

module.exports = router;
