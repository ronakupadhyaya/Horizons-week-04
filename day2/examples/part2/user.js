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

ageVirtual.get(function getAge(){
  console.log(this);
  var ageDifMs = Date.now() - this.birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);

})


ageVirtual.set(function (){

})

userSchema.methods.toggleGender = function (){
  if(this.gender === 'male'){
    console.log("YOOOOOOOOOOOOOOOOOOOOOOo")
    this.gender = 'female'
  }
  else if(this.gender === 'female'){
    this.gender = 'male'
  }
}

userSchema.statics.findByName = function ( name, callback){
this.find({'name.first': name}, callback);

}

var User = mongoose.model('User', userSchema);

module.exports = User;
