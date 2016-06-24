"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('../models/connect');
mongoose.connect(connect);

module.exports = {
  User: mongoose.model('User', {
  	username: {
  		type: String,
  		required: true
  	},
  	hashedPassword: {
  		type: String,
  		required: true
  	}
  })
};
