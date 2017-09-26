var mongoose = require('mongoose');


var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  }
});

var userModel = mongoose.model('User', UserSchema);

module.exports = {
  User: userModel
}
