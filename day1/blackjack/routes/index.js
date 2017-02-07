"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var Game = require('../models/Game.js');
var mongoose = require('mongoose');

var gameRepresentation = function(game) {
  return {
    id: game._id,
    bet: game.bet,
    gameStatus: game.gameStatus,
    playerTotalValue : game.playerTotalValue,
    dealerTotalValue : game.dealerTotalValue,
    playerStatus : game.playerStatus,
    dealerStatus : game.dealerStatus,
    playerHand : game.playerHand,
    dealerHand : game.dealerHand
  }
}

router.get('/', function (req, res, next) {
  if(req.query.status){
    Game.find({gameStatus: req.query.status}, {id: 1, gameStatus: 1}, function(err, games) {
      if(err) {
        res.json(err);
      } else {
        res.json({
          response: games
        })
      }
    })
  }
  else {
    Game.find({}, {id: 1, gameStatus: 1}, function(err, foundGames) {
      if(err) {
        res.json(err);
      } else {
        res.json({
          reponse: foundGames
        });
      }
    })
  }
});

router.post('/game', function(req, res, next) {
  // YOUR CODE HERE
  Game.newGame({
    playerCards: [],
    dealerCards: [],
    deck: [],
    // playerTotal: 0,
    // dealerTotal: 0,
    // gameStatus: "Not Started",
    playerStatus: "Pending",
    dealerStatus: "Pending"
  }, function(err, newGame) {
    if(err) {
      res.json({error: "Could not save game"})
    } else {
      res.redirect('/game/' + newGame._id)
    }
  });
});

router.get('/game/:id', function(req, res, next) {
  var gameId = req.params.id;
  Game.findOne({_id: gameId}, function(err, foundGame){
    if(err) {
      res.json(err);
    } else {
      res.render('viewgame.hbs', {
        title: "ballsack",
        game: gameRepresentation(foundGame)
      })
    }
  })
});

router.post('/game/:id', function(req, res, next) {
  // YOUR CODE HERE
  Game.findOne({_id:req.params.id}, function(err, found) {
    if(err) {
      res.json({error: "Could not find game"})
    } else {
      if(found.bet) {
        Game.findOneAndUpdate({_id:req.params.id}, {bet:req.body.bet}, {new:true}, function(err, updated) {
          if(err) {
            res.json({error: "Could not find game2"})
          } else {
            updated.dealInitial();
            res.json({ game: gameRepresentation(updated) });
          }
        })
      } else {
        res.json({error: "Bet already exists"});
      }
    }
  })
});

router.post('/game/:id/hit', function(req, res, next) {
  // YOUR CODE HERE
});

router.post('/game/:id/stand', function(req, res, next) {
  // YOUR CODE HERE
});

module.exports = router;
