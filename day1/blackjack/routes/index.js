"use strict";
var express = require('express');
var router = express.Router({
  mergeParams: true
});
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  return {
    id: game._id,
    bet: game.bet,
    gameStatus: game.gameStatus,
    playerStatus: game.playerStatus,
    dealerStatus: game.dealerStatus,
    playerHand: game.playerHand,
    dealerHand: game.dealerHand,
    playerTotal: game.playerValue,
    dealerTotal: game.dealerValue
  }
}

router.get('/', function(req, res, next) {
  if (req.query.status) {
    GameModel.find({
      gameStatus: req.query.status
    }, function(err, arr) {
      if (err) {
        res.send(err);
      } else {
        var returnArr = [];
        arr.forEach(function(game) {
          returnArr.push({
            id: game._id,
            gameStatus: game.gameStatus
          });
        });
        res.send(returnArr);
      }
    });
  } else {
    GameModel.find(function(err, arr) {
      if (err) {
        res.send(err);
      } else {
        var returnArr = [];
        arr.forEach(function(game) {
          returnArr.push({
            id: game._id,
            gameStatus: game.gameStatus
          });
        });
        res.send(returnArr);
      }
    });
  }
});

router.post('/game', function(req, res, next) {
  var newGame = new GameModel();
  GameModel.newGame(newGame, function() {
    res.redirect('/game/' + newGame._id);
  });
});

router.get('/game/:id', function(req, res, next) {
  GameModel.find({
    _id: req.params.id
  }, function(err, arr) {
    if (err) {
      res.send(err);
    } else if (arr.length === 0) {
      res.send('No game found by that ID!');
    } else {
      res.render('viewgame', {
        title: 'Game',
        game: gameRepresentation(arr[0])
      });
    }
  });
});

router.post('/game/:id', function(req, res, next) {
  GameModel.find({
    _id: req.params.id
  }, function(err, arr) {
    if (err) {
      res.status(500);
      res.send(err);
    } else if (arr.length === 0) {
      res.send('No game found by that ID!');
    } else {
      if (arr[0].bet === 0) {
        arr[0].bet = req.body.bet;
        arr[0].dealInitial();
        arr[0].save(function(err) {
          if (!err) {
            res.send(gameRepresentation(arr[0]));
          }
        })
      } else {
        res.send('No.');
      }
    }
  });
});

router.post('/game/:id/hit', function(req, res, next) {
  GameModel.find({
    _id: req.params.id
  }, function(err, arr) {
    if (err) {
      res.status(500);
      res.send(err);
    } else if (arr.length === 0) {
      console.log('No game found by that ID!');
    } else {
      if (arr[0].bet === 0 || arr[0].gameStatus !== 'In Progress') {
        res.send('Error.');
      } else {
        arr[0].hit();
        res.send(gameRepresentation(arr[0]));
      }
    }
  });
});

router.post('/game/:id/stand', function(req, res, next) {
  // YOUR CODE HERE
});

module.exports = router;
