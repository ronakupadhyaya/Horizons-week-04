"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  {
    id: null,
    playerBet:  game.playerBet,
    status: game.gameStatus,
    userTotal: game.userTotal,
    dealerTotal: game.dealerTotal,
    userStatus: game.userStatus,
    dealerStatus: game.dealerStatus,
    currentPlayerHand : game.currentPlayerHand,
    houseHand: game.currentDealerHand
  }
}

router.get('/', function (req, res, next) {
  // YOUR CODE HERE
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
