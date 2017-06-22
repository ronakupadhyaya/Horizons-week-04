"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var petSchema = new Schema({
  name: String,
  gender: String,
  owner: {
  	ref: 'User',
  	type: Schema.ObjectId
  }
});

var Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
