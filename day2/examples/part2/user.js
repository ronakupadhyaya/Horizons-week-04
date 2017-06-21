"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
  name: {
    first: String,
    last: String},
  gender: String,
  birthday: Date
  },
  {
  toJSON:{
    virtuals:true
  }
});

var ageVirtual = userSchema.virtual('age')
ageVirtual.get(function(){
  var current = new Date();
  return Math.floor((current-this.birthday)/(1000 * 60 * 60 * 24 * 365.25))
})


userSchema.methods.toggleGender = function(){
  if(this.gender==='male'){
    this.gender='female'
  }
  else{
    this.gender='male'
  }
}

userSchema.statics.findByName = function(fname, cb){
  this.find({"name.first": fname},cb);
}

var User = mongoose.model('User', userSchema);

module.exports = User;
