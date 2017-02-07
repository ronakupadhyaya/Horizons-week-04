var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

var User = mongoose.model('User',{
  username: {type: String, required: true},
  hashedPassword: {type: String, required: true}
});

module.exports = User;
