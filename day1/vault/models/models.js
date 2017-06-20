var mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds061248.mlab.com:61248/vault');

var User = mongoose.model('User', {
  username: String,
  hashedPassword: String
});



module.exports = {
  User: User
}
