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

var ageVirt = userSchema.virtual('age')

ageVirt.get(function(){
    return getAge(this.birthday)
})

function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

userSchema.methods.toggleGender = function(){
  if (this.gender === "female") {
    this.gender = "male";
  }
  else {
    this.gender = "female";
  }
}

userSchema.statics.findByName = function(name, callback) {
  this.find({"name.first": name}, callback)
}
// fullname.virtual.set(function(name){
//     var splot = name.split;
//     this.firstname = split[0];
//     this.lastname = splot[1];
// })


var User = mongoose.model('User', userSchema);

module.exports = User;
