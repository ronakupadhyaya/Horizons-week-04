"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  // YOUR CODE HERE
    return {
    id: game._id,
    playerBet: game.playerBet,
    status: game.gameStatus,
    playerTotal : game.playerHandValue,
    dealerTotal : game.dealerHandValue,
    playerStatus : game.playerStatus,
    dealerStatus : game.dealerStatus,
    playerHand : game.playerHand,
    dealerHand : game.dealerHand
  }
}

router.get('/', function (req, res, next) {
  // YOUR CODE HERE
  var status = req.params.status;
  if(req.params.status){
    GameModel.find({status: req.params.status}, {status: 1}, function(err, games){
      if(err){
        res.send(err);
      } else{
        res.json(games);
      }
    })
  } else{
    GameModel.find({}, {status: 1}, function(err, games){
      if(err){
        res.send(err);
      } else{
        res.json(games);

      }
    })
  }

});

router.post('/game', function(req, res, next) {
  // YOUR CODE HERE
  var createGame= new GameModel();
  console.log(createGame);
  GameModel.newGame( createGame, function(err, newGame){
    console.log("NEW GAME", newGame);
    res.redirect('/game/' + newGame._id);
  })
});

router.get('/game/:id', function(req, res, next) {
  // YOUR CODE HERE
  var gameId = req.params.id;
  GameModel.findById(gameId, function(err, game){
    res.render('viewgame', {game: game});
  })

});

router.post('/game/:id/bet', function(req, res, next) {
  // YOUR CODE HERE
  var gameId = req.params.id;
  var bet = req.body.bet;
  GameModel.findById(gameId, function(err, game){
    game.playerBet = bet;
    console.log("BET", game);
    game.save(function(err, game){
      console.log("game 1", game);
      game.dealInitial(function(err, game){
        console.log("GAME2", game);
        if(game.playerBet){
          res.send("Bet already placed");
        } else{
          res.json(gameRepresentation(game));
        }
      })
    })

  })
});

router.post('/game/:id/hit', function(req, res, next) {
  var gameId = req.params.id;
  GameModel.findById(gameId, function(err, game){
    if(err){
      res.send(err);
    } else{
      if(!game.playerBet){
        res.send("Player has not sent bet");
      }
      else if(game.gameStatus !== 'In Progress'){
        res.send("Game not in progress");
      } else{
        game.hit(function(err, game){
          if(err){
            res.send(err);
          } else{
            game.save(function(err, game){
              res.json(gameRepresentation(game));
            })

          }
        })
      }


    }
  })
});

router.post('/game/:id/stand', function(req, res, next) {
  // YOUR CODE HERE
});

module.exports = router;
