var mongoose = require('mongoose')
  , UserSchema = require(__dirname + '/../schemas/user')
  , bcrypt = require('bcrypt')
;

UserSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(app.config.saltFactor, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema, 'user');