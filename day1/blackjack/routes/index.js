"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');
var mongoose = require('mongoose');

mongoose.connect(config.MONGODB_URI);

var gameRepresentation = function(game) {
  {
    id: game._id,
    status: game.status,
    userTotal : game.playerVal,
    dealerTotal : game.dealerVal,
    userStatus : game.playerStat,
    dealerStatus : game.dealerStat,
    currentPlayerHand : game.playerHand,
    houseHand : game.dealerHand
  }
}

router.get('/', function (req, res, next) {
  var gameIdStat = [];
  Game.find(function(err, games){
    if(err) res.status(401).json('error': err, message:'No games');
    var gamesArr = games;
    if(req.query.status) {
      gamesArr = games.filter(function(gameObj){
        return gameObj.status === req.query.status
      })
    } render('/', {game: gamesArr.map(function(gameObj){
      return {gameObj._id,gameObj.status}
    });
  })
})
});

router.post('/game', function(req, res, next) {
  var newGame = new Game({
    playerHand: req.body.playerHand,
    dealerHand: req.body.dealerHand,
    deckCards: req.body.deckCards,
    playerVal: req.body.playerVal,
    dealerVal: req.body.dealerVal,
    status: req.body.status,
    playerStat: req.body.playerStat,
    dealerStat: req.body.dealerStat
  })
  newGame.save(function(err){
    if(err) console.log(err);
    res.status(200).json({sucess:true, response: newGame})
  })
  res.redirect('/game/' + newGame._id)
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
router.listen(3000);
