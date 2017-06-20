var mongoose = require('mongoose');

var User = mongoose.model('User', {    //'User' refers to the 'users' collection
  username: String,
  password: String
})

module.exports = {
  User: User
}
