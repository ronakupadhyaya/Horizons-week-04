var mongoose = require('mongoose');

var newUser = mongoose.model('newUser', {
  username: String,
  password: String
});

module.exports = {newUser: newUser};
