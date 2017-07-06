"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  // YOUR CODE HERE
  var result = {};
  result.id = game._id;
  result.playerBet = game.playerBet;
  result.status = game.gameStatus;
  result.userTotal = game.playerTotal;
  result.dealerTotal = game.dealerTotal;
  result.userStatus = game.playerStatus;
  result.dealerStatus = game.dealerStatus;
  result.currentPlayerHand = game.cardsInPlayerHand;
  result.houseHand = game.cardsInDealerHand;
  return result;
}

router.get('/', function (req, res, next) {
  // YOUR CODE HERE
  var result = {};
  GameSchema.find({}, function(err, games) {
    if (err) {
      console.log(err);
    } else {
      if (req.query.status) {
        games.forEach(function(game) {
          if (game.gameStatus === req.query.status) {
            result.push({status: game.gameStatus, id: game._id});
          }
        });
      } else {
        games.forEach(function(game) {
          result.push({status: game.gameStatus, id: game._id});
        });
      }
      res.json(result);
    }
  });
});

router.post('/game', function(req, res, next) {
  // YOUR CODE HERE
  new GameSchema({
    playerBet: 0,
    cardsInPlayerHand: [],
    cardsInDealerHand: [],
    cardsInDeck: [],
    playerStatus: "",
    dealerStatus: ""
  })
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
