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
  userTotal : game.playerTotal,
  dealerTotal : game.dealerTotal,
  userStatus : game.playerStatus,
  dealerStatus : game.dealerStatus,
  currentPlayerHand : game.playerCards,
  houseHand : game.dealerCards
}
}

router.get('/', function (req, res, next) {
  // YOUR CODE HERE
  var searchFields = {};
  if(req.query.status){
    searchFields = {gameStatus: req.query.status};
  }
  GameModel.find(searchFields, function(err,games){
    if(err){ console.log("Error finding games"); }
    if(!games){
      console.log("no games found");

    }
    var gamereps = [];
    games.forEach(function(game){
      gamereps.push({id: game._id, status: game.gameStatus})
    })
    // res.json({"games": gamereps})
    res.render('index',{
      games: gamereps
    })

  })

  // next();
});

router.post('/game', function(req, res, next) {
  // YOUR CODE HERE
  // var newgame = new GameModel();
  console.log("Creating a new game");
  var newgame = GameModel.newGame({}, function(error,savedGame){

    if(!error){
      // console.log(savedGame);
      res.redirect('/game/'+savedGame._id);
    }else{

      console.log("error creating new game");
    }
  });


});


router.use('/game/:id',function(req,res,next){
  GameModel.findById(req.params.id, function(err,game){
    if(err){ console.log("Error finding games"); }
    if(game){
      req.game = game;
      next();
      // res.render('viewgame', {
      //   title: "Game",
      //   game: gameRepresentation(game)
      // })
    }else{
      res.json({"error":"cant find game"})
    }
  })
})


router.get('/game/:id', function(req, res, next) {
  console.log("testing that i am here");
  var game = req.game;
  // if(req.query.indexOf("json=true") > -1){
  //
  // } else {
  //   res.render('viewgame', {
  //     title: "Game",
  //     game: gameRepresentation(game)
  //   })
  // }

    res.render('viewgame', {
      title: "Game",
      game: gameRepresentation(game)
    })

  // res.json(gameRepresentation(game))
  // res.json({title: "Game", game: gameRepresentation(game)})


});

router.get('/game/:id/json', function(req,res,next){
  var game = req.game;
  res.json(gameRepresentation(game));
})



router.post('/game/:id', function(req, res, next) {
  // YOUR CODE HERE
  var game = req.game;
  var bet = req.body.bet;
  console.log("bet from router.post", bet);
  game.dealInitial();
  if(game.playerBet){
    res.json({"error":"already declared bet"})
  }
  game.playerBet= req.body.bet;
  //save here?
  game.save(function(error){

    if(error){
      console.log("Error saving game");
    }else{
      res.json(gameRepresentation(game))

    }
  });




});

router.post('/game/:id/hit', function(req, res, next) {
  // YOUR CODE HERE
  var game = req.game;
  if(!game.playerBet || game.gameStatus!=='In Progress'){
    res.json({"error":"must declare bet or start game"})
  }
  game.hit();
  game.save(function(error){
    if(error){

    }else{
      res.json(gameRepresentation(game))

    }
  });
  // GameModel.findById(req.params.id, function(err,game){
  //   if(err){ console.log("Error finding games"); }
  //   if(game){
  //     if(!game.playerBet || game.gameStatus!=='In Progress'){
  //       res.json({"error":"must declare bet or start game"})
  //     }
  //     game.hit();
  //     game.save(function(error){
  //       if(error){
  //
  //       }else{
  //         res.json({"game": gameRepresentation(game)})
  //
  //       }
  //     });
  //   }
  // })

});

router.post('/game/:id/stand', function(req, res, next) {
  // YOUR CODE HERE
  var game = req.game;
  if(!game.playerBet || game.gameStatus!=='In Progress'){
    res.json({"error":"must declare bet or start game"})
  }
  console.log("abotu to call game stand");
  game.stand();
  console.log("returned from stand");
  game.save(function(error){
    if(error){

    }else{
      res.json({"game": gameRepresentation(game)})

    }
  });

  // GameModel.findById(req.params.id, function(err,game){
  //   if(err){ console.log("Error finding games"); }
  //   if(game){
  //     if(!game.playerBet || game.gameStatus!=='In Progress'){
  //       res.json({"error":"must declare bet or start game"})
  //     }
  //     game.stand();
  //     game.save(function(error){
  //       if(error){
  //
  //       }else{
  //         res.json({"game": gameRepresentation(game)})
  //
  //       }
  //     });
  //   }
  // })

});

module.exports = router;
