var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  Username:{
    type: String,
    required: true
  },
  Password:{
    type: String,
    required: true
  }
});

module.exports =  mongoose.model('User', UserSchema)
