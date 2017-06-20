"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
  // YOUR CODE HERE
  return {
    id: game._id,
    bet: game.bet,
    status: game.status,
    playerVal : game.playerVal,
    dealerVal : game.dealerVal,
    playerStatus : game.playerStatus,
    dealerStatus : game.dealerStatus,
    currentPlayerHand : game.playerHand,
    dealerHand : game.dealerHand
  }
}

router.get('/', function (req, res, next) {
  // YOUR CODE HERE
  if(req.query.status) {
    GameModel.find({status: req.query.status}, function(error, games) {
      if(error) {
        res.json({error: "error with GET /"})
      } else {
        var gameArr = [];
        games.forEach(function(game) {
          gameArr.push({id: game._id, currentStatus: game.status});
        });
        //res.json({success: true, response: gameArr});
        res.render("index", {games: gameArr})
      }
    });
  } else {
    //return all games in DB
    GameModel.find(function(error, games) {
      if(error) {
        res.json({error: "error with GET /"})
      } else {
        var gameArr = [];
        games.forEach(function(game) {
          gameArr.push({id: game._id, currentStatus: game.status});
        });
        //res.json({success: true, response: gameArr});
        res.render("index", {games: gameArr})
      }
    });
  }
});

router.post('/game', function(req, res, next) {
  // YOUR CODE HERE
  GameModel.newGame({
  }, function(error, savedGame) {
    if(error) {
      console.log("error saving")
    } else {
      res.redirect(`/game/${savedGame._id}`);
    }
  });
});

router.get('/game/:id', function(req, res, next) {
  // YOUR CODE HERE
  GameModel.findById(req.params.id, function(error, foundGame) {
    if(error) {
      res.json({error: "Error getting game by id"});
    } else if (foundGame){
      res.render("viewgame", {title: "", game: gameRepresentation(foundGame)});
    } else {
      res.json({error: "No game found"})
    }
  });

});

router.post('/game/:id', function(req, res, next) {
  // YOUR CODE HERE
  console.log("post");
  var bet = req.body.bet;
  GameModel.findById(req.params.id, function(error, foundGame) {
    if(error) {
      res.json({error: "Error posting game by id"});
    } else if (foundGame) {
      if(foundGame.bet !== 0) {
        res.json({error: "Bet placed"})
      } else {
        foundGame.dealInitial();
        foundGame.bet = bet;
        foundGame.save(function(error, savedGame) {
          res.json(gameRepresentation(savedGame));
        });
      }
    } else {
      res.json({error: "No game found"})
    }
  })
});

router.post('/game/:id/hit', function(req, res, next) {
  // YOUR CODE HERE
  GameModel.findById(req.params.id, function(error, foundGame) {
    if(error) {
      res.json({error: "Error posting game by id in hit"});
    } else if (foundGame) {
      if (foundGame.status !== "In Progress" || foundGame.bet === 0) {
        res.json({error: "Game not in progress"})
      } else {
        foundGame.hit();
        foundGame.save(function(error, savedGame) {
          res.json(gameRepresentation(savedGame));
        });
      }
    } else {
      res.json({error: "No game found"})
    }
  })
});

router.post('/game/:id/stand', function(req, res, next) {
  // YOUR CODE HERE
  GameModel.findById(req.params.id, function(error, foundGame) {
    if(error) {
      res.json({error: "Error posting game by id in stand"});
    } else if (foundGame) {
      if (foundGame.status !== "In Progress" || foundGame.bet === 0) {
        res.json({error: "Game not in progress"})
      } else {
        foundGame.stand();
        foundGame.save(function(error, savedGame) {
          res.json(gameRepresentation(savedGame));
        });
      }
    } else {
      res.json({error: "No game found"})
    }
  })
});

module.exports = router;
