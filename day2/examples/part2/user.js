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

//adds toggleGender

userSchema.methods.toggleGender = function(){
  if(this.gender === "male"){
    this.gender = "female"
  }
  else if(this.gender === "female" ){
    this.gender = "male"
  }
}

// adds static
userSchema.statics.getByFirstName= function (name, callback){
  this.find({"name.first": name},callback);
}

// adds the virtual age
var ageVirtual =userSchema.virtual('age')

ageVirtual.get(function(){
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
})

var User = mongoose.model('User', userSchema);

module.exports = User;
