"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  return {
    id: game.id,
    player1bet: game.player1bet,
    status: game.status,
    userTotal : game.userTotal,
    dealerTotal : game.dealerTotal,
    userStatus : game.userStatus,
    dealerStatus : game.dealerStatus,
    currentPlayerHand : game.currentPlayerHand,
    houseHand : game.houseHand
  }
}

router.get('/', function (req, res, next) {
  GameModel.find(function (err, games) {
    if (err) return next(err);
    var filteredGames = [];
    for (var i=0; i< games.length; i++){
      var game ={
        id: games[i].id,
        status: games[i].status === "over"? "over" : "progress"
      }
      if (!req.query.status || req.query.status === game.status){
        filteredGames.push(game)
      }
    }
    res.render('index', { title: "Games", filteredGames: filteredGames });
  });
});

router.post('/game', function(req, res, next) {
  GameModel.newGame({}, function (err, game) {
    if (err) return next(err);
    console.log('New game id:'+game.id);
    res.redirect('/game/'+game.id);
  });
});
router.get('/game/:id', function(req, res, next) {
  GameModel.findById(req.params.id, function (err, game) {
    if (err) return next(err);

    res.format({
      html: function(){
        res.render('viewgame', { title: 'View Game', game: gameRepresentation(game) });
      },
      json: function(){
        res.json(gameRepresentation(game));
      }
    });
  });
});

router.post('/game/:id', function(req, res, next) {
  console.log('here')
  GameModel.findById(req.params.id, function (err, game) {
    if (err) return next(err);
    if (game.status==="started") return next(new Error("Bet already set"))
    var bet = req.body.bet|| 10;
    game.player1bet=bet; //TODO error if already declared.
    GameModel.deal21(game);
    game.status="started";
    game.save();
    res.json(gameRepresentation(game));
    // Renders JSON of Game State Representation
  });
});

router.post('/game/:id/hit', function(req, res, next) {
  GameModel.findById(req.params.id, function (err, game) {
    if (err) return next(game);
    if (game.status!=="started" || game.player1bet === 0) return next(new Error("Start game and set bet"))
    GameModel.hit(game)
    game.save();
    res.json(gameRepresentation(game));
    // Renders JSON of Game State Representation
  });
});

// player has stopped dwaring cards.
// Dealer draws until they have more than 17
// Calculate winner -> Game over/
router.post('/game/:id/stand', function(req, res, next) {
  GameModel.findById(req.params.id, function (err, game) {
    if (err) return next(game);
    if (game.status!=="started" || game.player1bet === 0) return next(new Error("Start game and set bet"))
    GameModel.stand(game)
    game.save();
    res.json(gameRepresentation(game));
    // Renders JSON of Game State Representation
  });
});

/* Delete all stuff in db
GameModel.remove({}, function (err, user) {
if (err) console.log(err);
});*/

module.exports = router;
