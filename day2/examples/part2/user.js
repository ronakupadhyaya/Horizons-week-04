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

userSchema.methods.toggleGender = function() {
  if (this.gender === "male") {
    this.gender = "female"
  } else {
    this.gender = "male"
  }
}

userSchema.statics.findByName = function(name, callback) {
  User.find({"name.first": name}, callback)
}


var ageVirtual = userSchema.virtual('age')

ageVirtual.get(function() {
  console.log('inside function')
  var milisecondDiff = new Date() - this.birthday
  var age = Math.floor(milisecondDiff/1000/60/60/24/365.25)
  console.log(age)
  return age
})

var User = mongoose.model('User', userSchema);




module.exports = User;
