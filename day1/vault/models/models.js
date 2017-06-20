var mongoose = require('mongoose');


var user = mongoose.model('User', {
  username: String,
  hashedPassword: String,
})

module.exports = {
  user: user
}
