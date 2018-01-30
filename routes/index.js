var express = require('express');
var router = express.Router();
var fs = require('fs');
var tmplts = {};

/* GET tmplts. */
router.get('/tmplts', function(req, res, next) {
  fs.readdir('views/partials/', function (err, data) {
    for (i=0; i<data.length; i++) {
      tmplts[data[i].slice(0,-4)] = fs.readFileSync('views/partials/' + data[i], 'utf8');
    } 
    res.end('var tmplts = '+JSON.stringify(tmplts));
  });
});



router.get('/test', function(req, res){
  res.end("console.log('hi')")
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    ply: JSON.stringify({name:"plysheet"})
  });
});

module.exports = router;
