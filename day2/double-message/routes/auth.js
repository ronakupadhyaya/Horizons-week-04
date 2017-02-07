"use strict";

// Routes, with inline controllers for each route.
var express = require('express');
var router = express.Router();
var Contact = require('../models/models').Contact;
var User = require('../models/models').User;

//if user logged in redirect to /contacts
//if user not logged in redirect to /login
router.get('/', function(req, res) {

});

//Render signup.hbs
router.get('/signup', function(req,res) {
  res.render('signup')
});

//Validate User Fields
//--Username is not empty
//--Password is not empty
//--Passwords match
//Create new user
//Redirect to /login
router.post('/signup', function(req,res){

});

//Render login.hbs
router.get('login', function(req,res){
  res.render('login')
});

//Pass request onto passport with passport.authenticate('local')
//If successful redirect to /contacts
//else to /login
router.post('/login', function(req, res){

});


module.exports = router;
