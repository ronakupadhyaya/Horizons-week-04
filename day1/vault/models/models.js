var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  username: String,
  hashedPassword: String
});

var User = mongoose.model('User', schema);

module.exports = {
  User: User
};