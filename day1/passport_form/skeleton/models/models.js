// YOUR CODE HERE
var router = require('express').Router();
var mongoose = require('mongoose');
var models = require('../models/models');

mongoose.connect(require('./connect'));

module.exports = {
	users: mongoose.model('Cat', 
		{username: {
			type: String, 
			required: true
		},
		password: {
			type: String,
			required: true
		}
	})
};
