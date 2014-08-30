var mongoose = require('mongoose')
  , UserSchema = require(__dirname + '/../schemas/user')
;

module.exports = mongoose.model('User', UserSchema, 'user');