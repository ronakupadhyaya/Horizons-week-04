"use strict";

var mongoose = require('mongoose');
var connect = require('./connect');

mongoose.connect(connect);
module.exports ={
  user: mongoose.model('user',{
    username:{
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
  }
  })
};
