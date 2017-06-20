var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  hashedPassword: String,
})

var user = mongoose.model('User', userSchema)

module.exports = {
  User: user
};
