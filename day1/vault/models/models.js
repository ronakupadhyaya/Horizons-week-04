var mongoose = require('mongoose');

var User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
  },
  hashPassword: {
    type: String,
    required: true,
  }
})

module.exports = {
  User: User,
}
