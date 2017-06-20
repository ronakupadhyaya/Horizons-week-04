var mongoose = require('mongoose');

var User = mongoose.model("User", {
  name: String,
  hashedPassword: String
})

module.exports = {
  User: User
}
