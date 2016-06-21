"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  // YOUR CODE HERE
  this.id: game._id,
  this.playerBet: game.playerBet,
  this.status: game.status,
  this.userTotal : game.userTotal,
  this.dealerTotal : game.dealerTotal,
  this.userStatus : game.userStatus,
  this.dealerStatus : game.dealerStatus,
  this.currentPlayerHand : game.currentPlayerHand,
  this.houseHand : game.houseHand
}

router.get('/:status?', function (req, res, next) {
  // YOUR CODE HERE
  var status = req.params.status
  if (!status) {status=''}
  GameSchema.find({status:status}, function(error,cats) {
  	if (error) {
		console.log('Error', error);
	} else {

	}
  })
});

router.post('/game', function(req, res, next) {
  // YOUR CODE HERE
});

router.get('/game/:id', function(req, res, next) {
  // YOUR CODE HERE
});

router.post('/game/:id', function(req, res, next) {
  // YOUR CODE HERE
});

router.post('/game/:id/hit', function(req, res, next) {
  // YOUR CODE HERE
});

router.post('/game/:id/stand', function(req, res, next) {
  // YOUR CODE HERE
});

module.exports = router;
