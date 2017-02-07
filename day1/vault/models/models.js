var mongoose = require('mongoose');

var user = mongoose.model('user', {
  username: {
    type: String
  },
  hashedPassword: {
    type: String
  }
})

module.exports = {
  User: user
}
