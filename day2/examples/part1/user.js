"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

if (! process.env.MONGODB_URI) {
  console.log('MONGODB_URI config variable is missing. Try running "source env.sh"');
  process.exit(1);
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', console.error);

var userSchemaOptions ={
  toJSON:{
    virtuals:true
  }
}

var userSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  gender: String,
  birthday: Date
}, userSchemaOptions);

var ageVirtual = userSchema.virtual('age');

ageVirtual.get(function(){
  var birthday = this.birthday;
  function getAge(birthday) {
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
});

ageVirtual.set(function(age){
  this.birthday = age;
})

var User = mongoose.model('User', userSchema);

User.find().limit(1).exec(function(err, dbUsers) {
  // Only insert into DB if there are no users yet
  if (! dbUsers.length) {
    var users = require('./users.json').map(function(user) {
      return new User(user);
    });
    User.insertMany(users, function(err) {
      if (err) {
        console.log('Error populating data in MongoDB', err);
      } else {
        console.log('MongoDB initialized successfully.');
      }
    });
  }
});

module.exports = User;
