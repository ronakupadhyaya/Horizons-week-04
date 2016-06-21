var mongoose = require('mongoose');
mongoose.connect(require('./connect'));
/*
var userSchema = mongoose.Schema({
  username: String,
  password: String
}); */

module.exports = {
  User: mongoose.model('User', {
  	username: {
  	  type: String,
  	  required: true
  	}
  	password: {
  	  type: String,
  	  required: true
  	}
  })
};
