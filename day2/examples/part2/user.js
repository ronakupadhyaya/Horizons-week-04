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

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var ageVirtual = userSchema.virtual('age');
ageVirtual.get(function(){
  return getAge(this.birthday)
})
// ageVirtual.set(function())

userSchema.methods.toggleGender = function(){
  this.gender = (this.gender === "male" ? "female" : "male");
}

userSchema.statics.getByFirstName = function(name, cb){
  this.find({"name.first": name}, cb)
}

var User = mongoose.model('User', userSchema);

module.exports = User;
