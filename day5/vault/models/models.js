"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

// console.log when conncted
var db = mongoose.connection;

db.once('open', function callback () {
       console.log("DB Connected!");
});

var UserSchema = new mongoose.Schema({
	username: { type: String, index: { unique: true }},
	password: { type: String}
});

module.exports = {
  // YOUR MODELS HERE
  User: mongoose.model('User', UserSchema)
};
