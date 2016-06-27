"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('./models/connect');
mongoose.connect(connect);

var userSchema = new Schema({
	username: String,
	password: String
})

module.exports = {
  // YOUR MODELS HERE
  User: mongoose.model('User', userSchema)
};
