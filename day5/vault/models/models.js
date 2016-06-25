"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

// Create all of your models/schemas here, as properties.
var userSchema = mongoose.Schema({
  username: String,
  password: String
});

module.exports = {
  User: mongoose.model('User', userSchema)
};
