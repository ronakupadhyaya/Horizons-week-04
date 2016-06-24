"use strict";

var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI || require('./models/connect');
mongoose.connect(connect);

module.exports = {
  // YOUR MODELS HERE
};
