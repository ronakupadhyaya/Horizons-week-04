"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  id: game.id;
  playerBet: game.bet;
  status: game.status;
  userTotal : game.playerHandValue;
  dealerTotal : game.dealerHandValue;
  userStatus : game.playerStatus;
  dealerStatus : game.dealerStatus;
  currentPlayerHand : game.playerHand;
  houseHand : game.dealerHand;
}

router.get('/', function (req, res, next) {
  GameModel.find(function(err, games) {
    if (req.query.status) {
      games = games.filter(function(game) {
        if (game.status == req.query.status) {
          return game;
        }
      });
    }
    res.render('index', {
      games: games.map(function(game) {
        return {
          id: game.id,
          status: game.status,
        };
      }),
    });
  });
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
