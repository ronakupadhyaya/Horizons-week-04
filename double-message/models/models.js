var mongoose = require('mongoose');

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!
var connect = proces.env.MONGODB_URI || require('./connect');

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Create all of your models/schemas here, as properties.
var models = {
    // YOUR CODE HERE
    Contact: mongoose.model('Contact', {
      name: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      owner: {
        type: String
      }
    }),

    User: mongoose.model('User', {
      username: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      phone: {
        type: String
      }
    }),

    Message: mongoose.model('Message', {
      created: {
        type: Date,
        required: true
      },
      content: {
        type: String
      },
      user: {
        type: String
      },
      contact: {
        type: String
      }
    })
};

module.exports = models;
