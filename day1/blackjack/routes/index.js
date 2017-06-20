"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var Game = require('../models/Game.js');

var gameRepresentation = function(game) {
  var gameObject = {
    id: game._id,
    playerBet: game.playerBet,
    status: game.gameStatus,
    userTotal : game.playerHandValue,
    dealerTotal : game.dealerHandValue,
    userStatus : game.playerStatus,
    dealerStatus : game.dealerStatus,
    currentPlayerHand : game.playerHand,
    houseHand : game.dealerHand
  }
  return gameObject;
}

router.get('/', function (req, res, next) {
  if (req.query.status) {
    games = games.filter(function(game) {
      if (req.query.status === game.status) {
        return game;
      }
    });
  }
  Game.find(function(err,items){
    res.render('index',{items:items})
    // res.json({items:items});
  })
});

router.post('/game', function(req, res, next) {
  Game.newGame(req.body.items, function(err,game){
    if (err){
      res.json({error:err})
    }else{
      //console.log(game._id);
      res.redirect('/game/' + game._id);
    }
  })
});

router.get('/game/:id', function(req, res, next) {
  var id = req.params.id;
  Game.findById({_id:id},function(err,item){
    if (err){
      res.json({error:err});
    }else{
      res.render('viewgame',{
        title: "BlackJack Game",
        game: gameRepresentation(item)
      })
    }
  })
});
router.get('/game/:id/json', function(req, res, next) {
  Game.findById(req.params.id, function(err, item) {
    if (err){
      res.json({error:err});
    }else{
      res.json(gameRepresentation(item));
    }
  })
})

router.post('/game/:id/bet', function(req, res, next) {
  var bet = req.body.bet;
  var id = req.params.id;
  Game.findById({_id:id},function(err,item){
    if (err){
      res.json({error:err});
    }else{
      if (!item.playerBet){
        item.playerBet = bet;
        item.dealInitial();
        //console.log(gameRepresentation(item));
        item.save(function(err){
          if (err){
            res.json({error:err})
          }else{
            res.json(gameRepresentation(item))
          }
        })
      }else{
        res.json({error:"Player already declared Bet"})
      }
    }
  })
});

router.post('/game/:id/hit', function(req, res, next) {
  var id = req.params.id;
  Game.findById({_id:id},function(err,item){
    if (err){
      res.json({error:err});
    }else{
      // console.log(item.playerBet);
      // console.log(item.gameStatus);
      if (!item.playerBet || item.gameStatus !== "In Progress"){
        res.json({error: "Player has not placed a bet, or the game hasnt started!"})
      }else{
        item.hit();
        item.save(function(err){
          if (err){
            res.json({error:err})
          }else{
            res.json(gameRepresentation(item))
          }
        })
      }
    }
  })
});

router.post('/game/:id/stand', function(req, res, next) {
  var id = req.params.id;
  Game.findById({_id:id},function(err,item){
    if (err){
      res.json({error:err});
    }else{
      if (!item.playerBet || item.gameStatus !== "In Progress"){
        res.json({error: "Player has not placed a bet, or the game hasnt started!"})
      }else{
        item.stand();
        item.save(function(err){
          if (err){
            res.json({error:err});
          }else{
            res.json(gameRepresentation(item))
          }
        })
      }
    }
  })
});

module.exports = router;
