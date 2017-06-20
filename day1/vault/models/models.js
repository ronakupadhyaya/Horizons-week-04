var mongoose = require('mongoose');

var User = mongoose.model('User', {
  username: String,
  hashPassword: String
});

module.exports = {
  User: User
}
