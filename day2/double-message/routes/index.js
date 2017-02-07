"use strict";

// Routes, with inline controllers for each route.
var express = require('express');
var router = express.Router();
var Contact = require('../models/models').Contact;

// Read contacts from mongoose
//Render contacts using contacts.hbs
router.get('/contacts', function(req, res) {

});

//Render editContact.hbs
router.get('/contacts/new', function(req,res) {

});

//Read contact iwth id from mongoose
//Render editContact.hbs with contacts
router.get('/contacts/:id', function(req,res){

});

//Create a new contact
//Redirect to /contacts
router.post('/contacts/new', function(req,res){

});

//Update contact with given id
//Redirect to /contacts
router.post('/contacts/:id', function(req, res){

});

//Read all messages from mongoose
//Render messages.hbs with all messages
router.get('/messages', function(req,res){

});

//Read messages sent to contactId
//Render messages.hbs with messages sent to contact
router.get('/messages/:contactId', function(req,res){

});

//Render newMessage.hbs for a form to send a message to a contact by contactId
router.get('/messages/send/:contactId', function(req,res){

});

//Send message with Twilio to the number corresponding to a contact by contactId
//Create message in mongoose if Twilio is successful
//Redirect to /messages
router.post('/messages/send/:contactId', function(req,res){

});











module.exports = router;
