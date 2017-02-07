var mongoose = require('mongoose');

var User =  mongoose.model('User', mongoose.Schema({
  username: String,
  hashedpassword: String
}));

module.exports = {
  User: User
};
