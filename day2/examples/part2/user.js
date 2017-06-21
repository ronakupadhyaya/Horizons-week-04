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
  }
});


var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function() {
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  console.log(Math.abs(ageDate.getUTCFullYear() - 1970));
  return Math.abs(ageDate.getUTCFullYear() - 1970);
})

//If we're not setting anything, looks like we don't need the set
//ageVirtual.set(function(ageVirtual) {})

userSchema.methods.toggleGender = function() {
  if(this.gender === 'male') {
    this.gender = 'female';
  } else {
    this.gender = 'male';
  }
}

userSchema.statics.findByName = function(name, callback) {
  this.find({'name.first': name}, callback)
}

//model must be created AFTER all the virtual creation
var User = mongoose.model('User', userSchema);



module.exports = User;
