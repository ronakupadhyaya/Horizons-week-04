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
  return getAge(this.birthday);
})

userSchema.methods.toggleGender = function(){
  if (this.gender === "male"){
    this.gender = "female"
  }
  else{
    this.gender = "male"
  }
}

// ageVirtual.set(function(name){
//
// })

userSchema.statics.findByFirstName = function(firstname, callback){
  this.find({'name.first' : firstname}, callback);
}


var User = mongoose.model('User', userSchema);

module.exports = User;
