var mongoose = require('mongoose')
  , async = require('async')
  , app = {}
  , config = require(__dirname + '/config/development')
;

global.app = app;
app.config = config;

var User = require(__dirname + '/models/user')
  , mongo = mongoose.connect("mongodb://localhost/angular")
;

mongoose.connection.on('open', function() {
	var user = new User();
	user.name.first = "admin";
	user.name.last = "user";
	user.email = "admin@admin.com";
	user.password = "admin";
	user.save(function(){
		console.log("Init successfully");
		process.exit();
	});
});