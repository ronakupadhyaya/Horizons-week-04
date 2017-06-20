var mongoose = require('mongoose')

var User = mongoose.model("User", {
  username: String,
  password: String
})

module.exports = {
  User: User
}
