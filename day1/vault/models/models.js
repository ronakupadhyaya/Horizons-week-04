var mongoose = require('mongoose')

var User = mongoose.model('User', { //1st arguments: collection made uppercase and singular ,2nd argument: Schema
  username: String,
  password: String
});


module.exports = {
  User: User,
}
