"use strict";

var mongoose = require('mongoose');
var users = require('./user');
var Schema = mongoose.Schema;

var User = mongoose.model('User', users.userSchema);

var petSchema = new Schema({
  name: String,
  gender: String,
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});


var Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
