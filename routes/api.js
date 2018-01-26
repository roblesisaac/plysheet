var express = require('express');
var router = express.Router();
var auth = require('./auth');
var restful = require('node-restful');
var mongoose = restful.mongoose;
var collections = {};
var models = ['sheets', 'tmplts', 'sites'];

for (var i = 0; i < models.length; i++) collections[models[i]] = require('../models/' + models[i]);

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Pragma, Origin, X-Requested-With, Content-Type, Accept, x-access-token, userId");
  next();
});

var arraySearch = function(arr, field, searchValue) {
    if(!arr) return;
    for(var i = 0; i < arr.length; i++) {
        if(arr[i][field] === searchValue) return arr[i];
    }
};
var deleteRoute = function (name) {
  delete mongoose.connection.models[name];
  delete mongoose.models[name];
  delete mongoose.modelSchemas[name];
  for (var x = 0; x < router.stack.length; x++) {
    var stack = router.stack[x],
        route = stack.route;
    if (route && route.path.includes(name) || stack.path === name) {
      router.stack.splice(x, 1);
      x = x-1;
    }
  }
};
var rest = function(sheet) {
  try {
    if(!sheet.siteId) return 'Please include siteId';
    collections.sites.findOne({ _id: sheet.siteId }, function (err, site) {
      if(site) {
        var url =  '/' + site.url + '/api/' + sheet.name,
            siteId = site._id;
        if(sheet.delete !== 'false') deleteRoute(url);
        if(sheet.public !== 'true') router.use(url, auth);
        router.use(function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Pragma, Origin, X-Requested-With, Content-Type, Accept, x-access-token, userId");
          next();
        });
        sheet.methods = sheet.methods || ['get', 'put', 'post', 'delete'];
        if (!collections[sheet.name]) {
          sheet.tree = sheet.tree || 'name: String';
          var object = "new mongoose.Schema({"+sheet.tree+"},{ strict: false })";
          try {
            sheet.model = restful.model(url, eval(object));
          } catch (e) {
            sheet.model = restful.model(url, eval("new mongoose.Schema({name: String},{strict: false})"));
            return e;
          }
        } else {
          sheet.model = require('../models/' + sheet.name);
        }
        sheet.model.methods(sheet.methods)
        .before('get', function(req, res, next) {
          req.body.limit = 50;
          if(collections[sheet.name]) req.body.siteId = siteId;
          next();
        })
        .register(router, url);
        return 'New route created for ' + url + ' !';
      }
    });
  } catch (e) {
    return e;
  }
};

// collections.sheets.find({}, function (err, data) {
//   for (var i = 0; i < data.length; i++) {
//     data[i].delete = true;
//     rest(data[i]);
//   }
// });
// router.use('/api/sites', auth);
// collections.sites.methods(['get', 'put', 'post', 'delete']);
// collections.sites.register(router, '/api/sites');

// router.get('/:url/api', function (req, res) {
//     var unlocked = false;
//     function getSiteData(arr, site, obj) {
//       obj = obj || {};
//       var array = arr.slice(0),
//           key = array.shift();
//       if(['images', 'users', 'tmplts'].indexOf(key) > -1) return getSiteData(array, site, obj);
//       collections[key].find({ siteId: site._id }, function (err, data) {
//         if(['sheets', 'scripts'].indexOf(key) > -1) {
//           obj[key] = {};
//           for (var i = 0; i < data.length; i++) {
//             if (key === 'sheets') {
//               if (arraySearch(data[i].users, 'username', req.query.username) || arraySearch(data[i].users, 'username', 'everyone') && req.query.username !== 'public') {
//                   obj[key][data[i]._id] = data[i];
//                   unlocked = true;
//               } else {
//                 obj[key][data[i].name] = 'blocked';
//               }
//             } else if(key === 'scripts') {
//               if(unlocked) obj[key][data[i].sheetId] = data[i];
//             }
//           }
//         } else {
//           if(unlocked) {
//             if (key === 'links') {
//               var links = data;
//               for (var i = 0; i < links.length; i++) {
//                 var linkLength = links[i].layout.length,
//                     authLength = 0;
//                 for (var x = 0; x < links[i].layout.length; x++) {
//                   if (obj.sheets[links[i].layout[x].sheetId]) {
//                     authLength++;
//                   }
//                   if(authLength === linkLength) {
//                     obj[key] = obj[key] || [];
//                     obj[key].push(links[i]);
//                   }
//                 }
//               }
//             } else {
//               obj[key] = data;
//             }
//           }
//         }
//         if(array.length === 0) {
//           obj.site = site;
//           res.end('ply_data = ' + JSON.stringify(obj));
//         } else {
//           getSiteData(array, site, obj);
//         }
//       });
//     }
//     collections.users.findOne({ username: req.params.username }, function (err, user) {
//       collections.sites.findOne({ url: req.params.url }, function (e, site) {
//         if(!site) return res.end('ply_data = false');
//         try {
//           getSiteData(arr, site);
//         } catch (e) {
//           res.send(e)
//         }
//       });
//     });
// });

// router.get('/:url/images/:name', function (req, res) {
//   collections.sites.findOne({ url: req.params.url }, function (err, site) {
//     collections.images.findOne({ name: req.params.name, siteId: site._id }, function (e, data) {
//       if (!data) return res.send(req.params.name + ' image not found.');
//       var img = new Buffer(data.src.split(',')[1], 'base64');
//       res.writeHead(200, {
//         'Content-Type': 'image/jpeg',
//         'Content-Length': img.length
//       });
//       res.end(img);
//     });
//   });
// });
// router.get('/:url/scripts/:name', function (req, res) {
//   collections.sites.findOne({ url: req.params.url }, function (err, data) {
//     collections.scripts.findOne({ siteId: data._id, name: req.params.name }, function (err, filtered) {
//       if(!filtered) return res.end('');
//       res.end(filtered.txt);
//     });
//   });
// });
// router.get('/:url/css/:name', function (req, res) {
//   collections.sites.findOne({ url: req.params.url }, function (err, data) {
//     collections.sheets.find({ siteId: data._id, name: req.params.name }, function (err, filtered) {
//       if(filtered.length === 0) return res.end('');
//       res.header("Content-type", "text/css");
//       res.end(filtered[0].tmplts.CSS);
//     });
//   });
// });
// router.post('/api/deleteRoute', function (req, res) {
//   var url = req.query.name;
//   deleteRoute(url);
//   res.send(url +' route deleted!');
// });
// router.post('/api/jsonUpload', function (req, res) {
//   var db = mongoose.connection,
//       obj = req.body,
//       col = obj.collection,
//       data = obj.jsonParsed;
//   if (col && data) {
//     db.collection(col).insertMany(JSON.parse(data), function(err, doc) {
//       if(err) res.send(err);
//     });
//     res.send('Finished uploading json!');
//   } else {
//     res.send('Error uploading json.');
//   }
// });
// router.post('/api/newroute', function (req, res) {
//   res.send(rest(req.body));
// });
// router.use('/auth/login', auth);

module.exports = router;
