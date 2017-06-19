var mongoose = require('mongoose');


var user = mongoose.model('User', {
  username: String,
  password: String,
})

module.exports = {
  user: user
}
