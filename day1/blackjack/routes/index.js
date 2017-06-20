"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  return {
    id: game._id,
    playerBet: game.playerBet,
    status: game.status,
    userTotal: game.userTotal,
    dealerTotal: game.dealerTotal,
    userStatus: game.userStatus,
    dealerStatus: game.dealerStatus,
    currentPlayerHand: game.currentPlayerHand,
    houseHand: game.houseHand
  };
};

router.get('/', function (req, res, next) {
  GameModel.find({}, function(err, games) {
    if (err) {
      res.status(500).send("Could not retrieve games");
    } else {
      console.log(games);
      res.render("index", {games:games});
    }
  });
});

router.post('/game', function(req, res, next) {
  GameModel.newGame({
    playerBet: 0,
    status: "Not Started",
    userTotal: 0,
    dealerTotal: 0,
    userStatus: "Waiting",
    dealerStatus: "Waiting",
    currentPlayerHand: [],
    houseHand: []
  }, function(err, newGame) {
    if (err) {
      console.log(err);
      res.status(500).send("Could not save game to database");
    } else {
      res.redirect("/game/" + newGame._id);
    }
  });
});

router.get('/game/:id', function(req, res, next) {
  GameModel.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).send("Could not retrieve game from databse");
    } else {
      res.render("viewgame", {title: req.params.id, game: gameRepresentation(game)});
    }
  });
});

router.post('/game/:id', function(req, res, next) {
  GameModel.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).send("Could not retrieve game from databse");
    } else {
      game.dealInitial(~~+req.body.bet, function(err, currGame) {
        if (err) {
          res.status(500).send("Could not save game to database");
        } else {
          console.log(currGame.playerBet);
          res.render("viewgame", {title: req.params.id, game: gameRepresentation(currGame)});
        }
      });
    }
  });
});

router.post('/game/:id/hit', function(req, res, next) {
  GameModel.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).send("Could not retrieve game from databse");
    } else {
      game.hit(function(err, currGame) {
        if (err) {
          // console.log(err);
          res.status(500).send("Could not save game to database");
        } else {
          res.render("viewgame", {title: req.params.id, game: gameRepresentation(currGame)});
        }
      });
    }
  });
});

router.post('/game/:id/stand', function(req, res, next) {
  GameModel.findById(req.params.id, function(err, game) {
    if (err) {
      res.status(500).send("Could not retrieve game from databse");
    } else {
      game.stand(function(err, currGame) {
        if (err) {
          res.status(500).send("Could not save game to database");
        } else {
          res.render("viewgame", {title: req.params.id, game: gameRepresentation(currGame)});
        }
      });
    }
  });
});

module.exports = router;
