"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

module.exports = {
  // YOUR MODELS HERE
  Session: {username: {
  	type: String,
  	required: true
  },
  password: {
  	type: String,
  	required: true
  } 
},
User: {username: {
	type: String,
	required: true
	},
	password: {type: String,
	required: true
	}
}
};
