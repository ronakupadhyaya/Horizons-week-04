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

userSchema.statics.findByFirstName = function(name, callback){
  User.find({'name.first': name}, function(err, users){
    callback(err, users);
  })
};

userSchema.methods.toggleGender = function(){
  if(this.gender === 'male'){
    this.gender = 'female';
  } else {
    this.gender = 'male';
  }
}

var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function(){
  var msAge = Date.now()-this.birthday;
  return Math.floor(msAge/(3.154*Math.pow(10,10)));
});

ageVirtual.set(function(age){
  this.age = age;
});

var User = mongoose.model('User', userSchema);

module.exports = User;
