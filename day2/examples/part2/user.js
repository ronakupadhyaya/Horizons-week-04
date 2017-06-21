"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  gender: String,
  birthday: Date
},{
  toJSON:{
    virtuals:true
},

}), userSchemaOptions;

var ageVirtual=userSchema.virtual('age')

// ageVirtual

var User = mongoose.model('User', userSchema);

module.exports = User;
