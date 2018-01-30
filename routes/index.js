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
  res.end("ply.sheet ['ply-login'] = {data: function {} {return {username: '', password: '', ply: ply};}, methods: {login: function .post ('/ users', {username: this.username, password: this.password}) .this (function (res) {console.log (res.data)}};}}, template: tmplts._login , watch: {'ply.name': function () {console.log ('changed to' + ply.name);}}} for {var sheet in ply.sheet} {var vue = ply.sheet [sheet] ; delete vue.name; Vue.component (sheet, vue);} ")
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    ply: JSON.stringify({name:"plysheet"})
  });
});

module.exports = router;
