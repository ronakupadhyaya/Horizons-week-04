var mongoose = require('mongoose');
var User=mongoose.model('User',{
  username:String,
  hashedPassword:String
})

module.exports = {
  User: User
}
