var express = require('express');
var router = express.Router();
var fs = require('fs');
var tmplts = {};
var ply = {
  link: 'login',
  name: 'plySheet',
  sheet: {
    'ply-login': {
      data: function() {
        return {
          username: '',
          password: '',
          ply: ply
        };
      },
      methods: {
        login: function() {
          axios.post('/users', {username: this.username, password: this.password}).then(function(res){
            console.log(res.data);
          });
        }
      },
      template: tmplts._login,
      watch: {
        'ply.name': function() {
          console.log('changed to '+ply.name);
        }
      }     
    }
  },
  token: null,
  user: 'public'
};

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
  res.end("console.log(ply)")
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    ply: JSON.stringify(ply)
  });
});

module.exports = router;
