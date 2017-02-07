var mongoose = require('mongoose');

//model for user
var user = mongoose.model('user', {
  username : String,
  password : String
});

module.exports = {
  user: user
}
