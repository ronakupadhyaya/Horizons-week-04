var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  hashedPassword: String
});

module.exports = {
  User: mongoose.model('User', userSchema)
};
