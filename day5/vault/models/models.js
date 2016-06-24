"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

module.exports = {
  // YOUR MODELS HERE
User: mongoose.model("User",{username: {
	type: String,
	required: true
	},
	hashedpassword: {type: String,
	required: true
	}
})
};
