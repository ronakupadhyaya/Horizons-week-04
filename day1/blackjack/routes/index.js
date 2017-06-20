"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  // YOUR CODE HERE
    var obj={
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
  return obj;
}

router.get('/', function (req, res, next) {
  // YOUR CODE HERE
  Game.find(function(err,games){
    if(err)console.log(err);
    else{
      res.render('index',{
        games:games
      })
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
