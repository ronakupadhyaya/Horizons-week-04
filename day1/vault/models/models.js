var mongoose = require('mongoose');

var User = mongoose.model('User',{
  username: String,
  hashedPassword: String,
  _id: String,
})

module.exports = {
  User: User
}
