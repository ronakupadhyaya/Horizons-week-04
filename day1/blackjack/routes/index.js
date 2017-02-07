"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  return {
    id: game._id,
    playerBet: game.playerBet,
    status: game.status,
    userTotal : game.userTotal,
    dealerTotal : game.dealerTotal,
    userStatus : game.userStatus,
    dealerStatus : game.dealerStatus,
    currentPlayerHand : game.currentPlayerHand,
    houseHand : game.houseHand
  }
  // YOUR CODE HERE
}

router.get('/', function (req, res, next) {
  GameModel.find(function(err, games) {
    if (err){
      console.log("games not found", err);
    }
    else if (req.query.status) {
      games = games.filter(function(game) {
        if (req.query.status === game.status) {
          return game;
        }
      });
    }
  });
});

router.post('/game', function(req, res, next) {
  GameModel.newGame({}, function (err, game) {
    if (err){
      console.log('game not found', err);
    } else {
    res.redirect('/game/id');
  }
  });
  // YOUR CODE HERE
});

router.get('/game/:id', function(req, res, next) {
  GameModel.findById(req.params.id, function(err, game) {
    if (err){
      console.log('game not found', err);
    } else {
    res.render('viewgame', {
      title: "Game",
      game: gameRepresentation(game)
    });
  }
});
  // YOUR CODE HERE
});

router.post('/game/:id', function(req, res, next) {
  GameModel.findById(req.params.id, function (err, game) {
    if (err){
      console.log('game not found', err);
    } else {
      
    }
  });
  // YOUR CODE HERE
});

router.post('/game/:id/hit', function(req, res, next) {
  // YOUR CODE HERE
});

router.post('/game/:id/stand', function(req, res, next) {
  // YOUR CODE HERE
});

module.exports = router;
