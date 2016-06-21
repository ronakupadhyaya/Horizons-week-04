"use strict";
var express = require('express');
var router = express.Router({ mergeParams: true });
var GameModel = require('../models/Game.js');

var gameRepresentation = function(game) {
	return {
		id: game._id,
		playerBet: game.bet,
		status: game.gameStatus,
		userTotal : game.playerVal,
		dealerTotal : game.dealerVal,
		userStatus : game.playerStatus,
		dealerStatus : game.dealerStatus,
		currentPlayerHand : game.playerCards,
		houseHand : game.dealerCards
	}
}

router.get('/', function (req, res, next) {
	GameModel.find(function(err, games){
		if(err){
			console.log(err);
		}
		else {
			var arr = [];
			for (var i = 0; i < games.length; i ++){
				var singleGame = gameRepresentation(games[i]);
				var gameObj = {};
				gameObj.id = singleGame.id;
				gameObj.status = singleGame.status;
				if (req.query.status){
					if (req.query.status === singleGame.status){
						arr.push(gameObj);
					}
				}
				else {
					arr.push(gameObj);
				}
			}
		res.render('index', arr);
		}
	});
});

router.post('/game', function(req, res, next) {
  // YOUR CODE HERE
});

router.get('/game/:id', function(req, res, next) {
  // YOUR CODE HERE
});

router.post('/game/:id', function(req, res, next) {
  // YOUR CODE HERE
});

router.post('/game/:id/hit', function(req, res, next) {
  // YOUR CODE HERE
});

router.post('/game/:id/stand', function(req, res, next) {
  // YOUR CODE HERE
});

module.exports = router;
