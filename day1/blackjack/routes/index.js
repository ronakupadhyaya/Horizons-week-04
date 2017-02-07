"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var Game = require('../models/Game.js');
var mongoose = require('mongoose');

var gameRepresentation = function(game) {
  return {
    id: game._id,
    preGameBet: game.preGameBet,
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
  var game = new Game ({
    // preGameBet: req.body.bet,
    gameStatus: "Not Started",
    // playerTotalValue : 0,
    // dealerTotalValue : 0,
    playerStatus : "Pending",
    dealerStatus : "Pending",
    playerHand : [],
    dealerHand : []
  })
  // res.json({
  //   success: true,
  //   response: game
  // });
  var gameId = game._id;
  game.save(function(err){
    if(err){
      res.json(err);
    } else {
      res.redirect('/game/' + gameId);
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
      if(found.preGameBet === 0) {
        Game.findOneAndUpdate({_id:req.params.id}, {preGameBet:req.body.bet}, {new:true}, function(err, updated) {
          if(err) {
            res.json({error: "Could not find game"})
          } else {
            console.log(updated);
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
