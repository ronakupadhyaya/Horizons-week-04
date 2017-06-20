var mongoose = require('mongoose')

var User = mongoose.model('User', {
  username: String,
  _id: String,
  hashedPassword: String
})

module.exports = {
  User: User
}
