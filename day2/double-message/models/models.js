var mongoose = require('mongoose');

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!

// TEMPORARILY DIRECTED TO ./config TO TEST.. CHANGE LATER
var connect = process.env.MONGODB_URI || require('../config.js').MONGODB_URI;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Create all of your models/schemas here, as properties.
var models = {

  Contact: mongoose.model('Contact', {
    name: String,
    phone: String,
    userId: String //aka UserId aka _id
  }),

  User: mongoose.model('User', {
    username: String,
    password: String,
    phone: String
  }),
  Message: mongoose.model('Message', {
    created: Date,
    content: String,
    userId: String, // sender
    contactId: String // contact id
  })
};






// because exports is "models", how are we going to reference
// inner objects?
module.exports = models;
