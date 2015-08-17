var User = require(__dirname + '/../models/user.js');
var async = require('async');
var jwt = require('jsonwebtoken');

exports.login = function(req, res, next) {
	var username = req.body.username || '';
	var password = req.body.password || '';

	if (username == '' || password == '') return res.send(401);

	User.findOne({username: username}, function(err, user) {
		if(err) {
			console.log(err);
			return send(401);
		}

		user.comparePassword(password, function(isMatch) {
			if (!isMatch) {
				console.log("Attempt failed to login with " + user.username);
				return res.send(401);
			}
			req.user = user;
			var token = jwt.sign({id: user._id}, app.config.session.secret, {expiresInMinutes: 60});
			res.json({token: token});
		});

	});
};

exports.logout = function(req, res, next) {
	if (req.user) {
		var username = req.user.username;
		User.findById(req.user.id, function(err, user) {
			delete req.user;
			return res.send({username: user.username});
		});
	}
	else {
		return res.send(401);
	}
};

exports.getConfig = function(req, res, next) {
	return res.json(app.config);
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

exports.getCurrentUser = function(req, res, next) {
	var userId = req.user.id;
	User.findById(userId, function(err, user) {
		if(err) return next(err);
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
		user.username = formData.username;
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

exports.checkUsername = function(req, res, next) {
	var field = req.params.field || '';
	var username = req.body.username || '';

	if (!field || !username) return send({userExist: false});
	
	User.findOne().where(field, username).exec(function(err, user) {
		if (err) return next(err);
		if(user) {
			return res.send({userExist: true});
		} else {
			return res.send({userExist: false});
		}
	});
};
