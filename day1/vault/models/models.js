var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
  Username: {
    type: String,
    required: true
  },
  HashedPassword: {
    type: String,
    required: true
  }
});

module.exports = {
  User: mongoose.model('User', UserSchema)
}
