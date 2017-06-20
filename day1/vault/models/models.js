var mongoose = require('mongoose');

var User = mongoose.model('Users', {
  username: String,
  hashedPassword: String
});


module.exports = {
  User: User
}
