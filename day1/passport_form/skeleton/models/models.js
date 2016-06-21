var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var connect = require('./connect.js');
mongoose.connect(connect);

var User = new Schema({
  username:  String,
  password: String
});

module.exports = mongoose.model('User', User);
