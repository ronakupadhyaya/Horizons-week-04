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

// This function may or may not offend some people
userSchema.methods.toggleGender = function(gender) {
  if(this.gender === "male"){
    this.gender = "female";
  } else {
    this.gender = "male";
  }
}

userSchema.statics.findByName = function(name, callback) {
  this.find({"name.first": name}, callback);
}
// The Getter function for the age virtual
ageVirtual.get(function(birthday) {
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // Milliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
})

var User = mongoose.model('User', userSchema);

module.exports = User;
