"use strict";

// Project model
var mongoose = require('mongoose');


var Contact = mongoose.model('Contact', {
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  owner: {
    type: String
  }
});

var User = mongoose.model('User', {
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  }
})

var Message = mongoose.model('Message', {
  created: {
    type: Date,
    required: true
  },
  content: {
    type: String
  },
  user: {
    type: String
  },
  contact: {
    type: String
  }
})

// title: make this field required
// goal: Type: Number, required
// description: Type: String
// start: Type: Date, required
// end: Type: Date, required

module.exports = {
  Contact : Contact,
  User: User
}
