"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

module.exports = {
  User: mongoose.model('User', userSchema)
};