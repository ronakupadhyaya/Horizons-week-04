var app = require('express');
var app = app();
var mongoose = require('mongoose');
var validator = require('express-validator');

app.use(validator);

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

module.exports = {
  User: mongoose.model('User', userSchema)
};
