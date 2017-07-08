
var mongoose = require('mongoose');

var User = mongoose.model('user', {
  username: String,
  hashedPassword: String
})

module.exports = {
  User: User
}
