var mongoose = require('mongoose'); //from mongoose module
var Schema = mongoose.Schema;
var userSchema = new Schema({
  username: String,
  hashedPassword: String

})
var User = mongoose.model('User', userSchema);

module.exports = {
  User: User
}
