var mongoose = require('mongoose');

var User = mongoose.model('User', {
  username: String,
  password: String,
  _id: Number
})

module.exports = {
  User: User
}
