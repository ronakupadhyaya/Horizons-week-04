"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var Game = require('../models/Game.js');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var gameRepresentation = function(game) {
  // YOUR CODE HERE
  return {
    id: game._id,
    bet: game.bet,
    gameStatus: game.gameStatus,
    playerTotal: game.playerTotal,
    dealerTotal: game.dealerTotal,
    playerStatus: game.playerStatus,
    dealerStatus: game.dealerStatus,
    playerCards: game.playerCards,
    dealerCards: game.dealerCards
  }
}

router.get('/', function (req, res, next) {
  // YOUR CODE HERE
  if(req.query.status) {
    Game.find({gameStatus: req.query.status}, {id: 1, gameStatus: 1}, function(err, gamesWithStatus) {
      if(err) {
        res.json(err);
      } else {
        res.json({
          response:gamesWithStatus
        })
      }
    })
  } else {
    Game.find({}, {id: 1, gameStatus: 1}, function(err, games) {
      if(err) {
        res.json(err);
      } else {
        res.json({
          response:games
        })
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
  // YOUR CODE HERE
  Game.findOne({_id:req.params.id}, function(err, found) {
    if(err) {
      res.json({error: "No game found"})
    } else {
      res.render('viewgame.hbs', {
        title: found._id,
        game: gameRepresentation(found)
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
      if(found.bet === 0) {
        Game.findOneAndUpdate({_id:req.params.id}, {bet:req.body.bet}, {new:true}, function(err, updated) {
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
