var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema ({

username: String,
password: String
});

var usermodel = mongoose.model('User', UserSchema);

module.exports = {
  User: usermodel
}
