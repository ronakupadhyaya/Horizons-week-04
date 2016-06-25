"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('./connect.js');
mongoose.connect(connect);

module.exports = {
  User: mongoose.model('User', {
  	username: {
  		type: String,
  		required: true
  	},
  	password: {
  		type: String,
  		required: true
  	}
  })
};
