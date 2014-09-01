var mongoose = require('mongoose')
  , Schema = mongoose.Schema
;

var UserSchema = new Schema({
	name: {
		first : {type: String, default: ''},
		last: {type: String, default: ''}
	},
	phone: {type: String, default: ''},
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true}
});

module.exports = UserSchema;