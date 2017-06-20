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

ageVirtual.get(function(){
  var now = new Date();
  var cur = now.getYear();
  var then = new Date(this.birthday);
  var past = then.getYear();
  if (now.getMonth() > then.getMonth()){
    return cur - past;
  }
  else{
    return cur - past - 1;
  }
});

ageVirtual.set(function(age){

});

userSchema.methods.toggleGender = function(){
  if (this.gender === 'male'){
    this.gender = 'female';
  }
  else{
    this.gender = 'male'
  }
};

userSchema.statics.findByName = function (name, callback) {
  this.find({'name.first': name}, callback);
};

var User = mongoose.model('User', userSchema);

module.exports = User;
