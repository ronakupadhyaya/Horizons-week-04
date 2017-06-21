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


userSchema.statics.getByFirstName = function (name, callback) {
  this.find({"name.first": name}, callback);
}

userSchema.methods.toggleGender = function() {
  console.log("Hi")
  console.log(this.gender)
  if (this.gender === "male") {
    return this.gender = "female"
  }
  if (this.gender === "female") {
    return this.gender = "male"
  }
}


var ageVirtual = userSchema.virtual('age')

ageVirtual.get(function(){
    var ageDifMs = Date.now() - this.birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  })

var User = mongoose.model('User', userSchema);

module.exports = User;
