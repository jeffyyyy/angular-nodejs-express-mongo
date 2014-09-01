var User = require(__dirname + '/../models/user.js');
var async = require('async');
var jwt = require('jsonwebtoken');

exports.login = function(req, res, next) {
	var username = req.body.username || '';
	var password = req.body.password || '';

	if (username == '' || password == '') return res.send(401);

	User.findOne({email: username}, function(err, user) {
		if(err) {
			console.log(err);
			return send(401);
		}

		user.comparePassword(password, function(isMatch) {
			if (!isMatch) {
				console.log("Attempt failed to login with " + user.email);
				return res.send(401);
			}

			var token = jwt.sign(user, app.config.session.secret, {expiresInMinutes: app.config.session.maxAge});
			res.json({token: token});
		});

	});
};

/*
 * Serve user info in JSON format to our AngularJS client
 */

exports.getUsers = function (req, res, next) {
	User.find({}, function(err, users) {
		if(err) return next(err);
		return res.json(users);
	});
};

exports.getUser = function(req, res, next) {
	var userId = req.params.id;
	User.findById(userId, function(err, user) {
		if(err) return next(err);
		if(!user) return res.send(400, {message:"wrong"});
		return res.json(user);
	});
};

exports.updateUser = function(req, res, next) {
	var formData = req.body
	  , userId = req.params.id
	;

	var user;
	async.parallel([function(callback) {
		if (userId == 'new') {
			user = new User();
			return callback();
		} else {
			User.findById(userId, function(err, u) {
				if (err) return callback(err);
				user = u;
				return callback();
			})
		}
	}], function(err, results) {
		if(err) return next(err);

		user.name = {};
		user.name.first = formData.name.first;
		user.name.last = formData.name.last;
		user.phone = formData.phone;
		user.email = formData.email;
		user.password = formData.password;

		user.save(function(err, user) {
			if(err) return next(err);
			return res.send(200);
		})
	});
};

exports.removeUser = function(req, res, next) {
	var userId = req.params.id;
	
	if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
		User.findById(userId, function(err, user) {
			if(err) return next(err);
			user.remove(function(err) {
				if(err) return next(err);
				return next();
			})
		})
	} else {
		return res.send(401, {message: "user id is not valid"});
	}
};
