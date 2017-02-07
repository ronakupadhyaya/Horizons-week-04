"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var Game = require('../models/Game.js');

var gameRepresentation = function(game) {
  return {
    id: game.id,
    playerBet: game.playerBet,
    status: game.status,
    userTotal: game.userTotal,
    dealerTotal: game.dealerTotal,
    userStatus: game.userStatus,
    dealerStatus: game.dealerStatus,
    currentPlayerHand: game.currentPlayerHand,
    houseHand: game.houseHand
  }
}


router.get('/', function (req, res, next) {
  // YOUR CODE HERE
  Game.find(function(err, games) {
    if (err) {
      return res.status(500).json({err})
    };
    if (req.query.status) {
      games = games.filter(function(game) {
        return game.status === req.query.status
      });
    };
    res.render('index', {
      games: games.map(function(game) {
        return {
          id: game._id,
          status: game.status
        };
      })
    });
  });
});

router.post('/game', function(req, res, next) {
  Game.newGame({}, function(err, game){
    if (err) {
      return res.status(500).json({err})
    }
    res.redirect('/game/' + game._id);
  });
});

router.get('/game/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      return res.status(500).json({err});
    }
    res.render('viewgame', {
      title: "Game",
      game: gameRepresentation(game)
    });
  });
});

router.post('/game/:id', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      console.log('called')
      return res.status(500).json({err});
    }
    if (game.status === "In Progress") {
      return next(new Error("Bet made already"))
    }
    game.playerBet = req.body.bet;
    game.dealInitial();
    game.save(function(err) {
      if (err) {
        console.log('called')
        return res.status(500).json({err});
      }
      res.json(gameRepresentation(game))
    })
  });
});

router.post('/game/:id/hit', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      return res.status(500).json({err});
    }
    if (game.status !== "In Progress" || game.playerBet === 0) {
      return next(new Error("Game needs to start or bet needs tobe made."))
    }
    game.hit()
    game.save(function(err) {
      if (err) {
        return res.status(500).json({err});
      }
      res.json(gameRepresentation(game))
    })
  });
});

router.post('/game/:id/stand', function(req, res, next) {
  Game.findById(req.params.id, function(err, game) {
    if (err) {
      return res.status(500).json({err});
    }
    if (game.status !== "In Progress" || game.playerBet === 0) {
      return next(new Error("Game needs to start or bet needs tobe made."))
    }
    game.stand()
    game.save(function(err) {
      if (err) {
        return res.status(500).json({err});
      }
      res.json(gameRepresentation(game))
    })
  });
});

module.exports = router;
