var express = require('express');
var app = express();
var router = express.Router();
var users = require('../models/users');
var jwt = require('jsonwebtoken'); // create, sign, and

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST", "PUT", "DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, userId");
  next();
});

var loginUser = function(req, res) {
	// find the user
	users.findOne({username: JSON.parse(JSON.stringify(req.body)).username}, function(err, user) {
		if (err) throw err;
		if (!user) {
			res.json({ success: false, message: 'User not found.' });
		} else if (user) {
			user.comparePassword(req.body.password, function(err, isMatch){
				if(isMatch && isMatch === true) {
					// if user is found and password is right create a token
					var token = jwt.sign({
						_id: user._id,
						username: user.username,
						name: user.name,
						password: user.password
					}, user.password, {
						expiresIn: '15h' // expires in 15 hours
					});
					res.json({
						_id: user._id,
						username: user.username,
						name: user.name,
						password: user.password,
						token: token
					});
				} else {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				}
			});
		}
	});
};

//newUSer
router.post('/signUp', function(req, res) {
	//Check if user collection is empty
	users.findOne({username: req.body.username}, function (err, data) {
		if (!data) {
			var newUser = new users(req.body);
			newUser.save(function(err) {
				if (err) throw err;
				loginUser(req, res);
			});
		} else {
			res.json({ success: false, message: 'Username already exists.' });
		}
	});
});
//Login
router.post('/authenticate', function(req, res) {
	loginUser(req, res);
});

var errorMessage = { success: false, message: 'No token and or userid provided.' };

//Check Token
router.use(function(req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'],
			userid = req.body.userid || req.query.userid || req.headers.userid;
	// decode token
	if (token) {
		// verifies secret and checks exp
		users.findOne({ _id: userid }, function (err, user) {
			if(!user) return res.status(403).send(errorMessage);
      jwt.verify(token, user.password, function(err, decoded) {
  			if (err) {
  				return res.json({ success: false, message: 'You are logged out.' });
  			} else {
  				// if everything is good, save to request for use in other routes
  				req.decoded = decoded;
  				next();
  			}
  		});
		});
	} else {
		// if there is no token return an error
		return res.status(403).send(errorMessage);
	}
});

router.get('/check', function(req, res) {
	res.json(req.decoded);
});

module.exports = router;
