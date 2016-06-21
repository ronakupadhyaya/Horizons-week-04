var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
	betbefore: Number,
	cardsinhand: Array,
	cardsindealer: Array,
	cardsindeck: Array,
	valueinplayer: {
		type: Number,
		default: 0
	},
	valueindealer: {
		type: Number,
		default: 0
	},
	statusGame: {
		type: String,
		default: "Not Started"
	},
	statusPlaer: String,
	statusDealer: String
	
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
	this.suit = suit;
	this.val = val;
	this.symbol = symbol;
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
	var suits = {0: 'hearts', 1: "clubs", 2: "diamond", 3: "spades" }
	var special = {11: "J", 12: "Q", 13: "K", 14: "A"}
	for(var key in suits){
		for (var i = 2; i <= 13; i++){
			if (i > 10){
				this.deck.push(new Card(suits[key],i, special[i]));
			} else {
				this.deck.push(new Card(suits[key], i));
			}
		}
	}
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
};

GameSchema.methods.hit = function(){
  // YOUR CODE HERE
};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
}

module.exports = mongoose.model('Game', GameSchema);