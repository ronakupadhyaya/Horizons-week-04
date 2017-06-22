"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchemaOptions = {
  virtuals: true
}

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
  }
}, userSchemaOptions);

var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function(){
  var date = new Date();
  var diff = Math.abs(date - this.birthday);
  diff = Math.floor(diff / 1000 / 60 / 60 / 24 / 364.24);
  return diff;
});

userSchema.methods.toggleGender = function() {
  if(this.gender === 'male') {
    this.gender = 'female'
  } else if (this.gender === 'female') {
    this.gender = 'male'
  }
}

userSchema.statics.getByFirstName = function(firstname, callback) {
  this.find({'name.first': firstname}, callback);
}

var User = mongoose.model('User', userSchema);

module.exports = User;
