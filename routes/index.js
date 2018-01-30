var express = require('express');
var router = express.Router();
var fs = require('fs');
var tmplts = {};
var ply = {
  link: 'login',
  name: 'plySheet',
  sheet: {},
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
  res.end("console.log(document.querySelector('input').clientHeight)\nply.sheet['ply-login'] = {\n  data: function() {\n    return {\n      username: '',\n      password: '',\n      ply: ply\n    };\n  },\n  methods: {\n    login: function() {\n      axios.post('/users', {username: this.username, password: this.password}).then(function(res){\n        console.log(res.data);\n      });\n    }\n  },\n  template: tmplts._login,\n  watch: {\n    'ply.name': function() {\n      console.log('changed to '+ply.name);\n    }\n  }  \n}");  
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    ply: JSON.stringify(ply)
  });
});

module.exports = router;
