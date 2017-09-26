var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  playerBet: Number,
  playerCards: Array,
  dealerCards: Array,
  deckCards: Array,
  playerCardsValue: {
	  type: Number,
	  default: 0
  },
  dealerCardsValue: {
	  type: Number,
	  default: 0
  },
  gameStatus: {
	  type: String,
	  default: 'Not Started'
  },

  playerStatus: String,
  dealerStatus: String
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
  this.suit: suit,
  this.val: val,
  this.symbol: symbol
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  var suit = {
	  '1': "Hearts",
	  '2': "Diamonds",
	  '3': "Spades",
	  '4': "Clubs"
  };
  var deck = [];

  for(var i = 0; i < 4; i++){
	  var cardSuit = suit[i.toString()];
	  for(var j = 2; j < 11; j++){
		  var card = new Card(cardSuit, j, j.toString());
		  deck.push(card);
	  }
	  var ace = new Card(cardSuit, 11, 'A');
	  var king = new Card(cardSuit, 10, 'K');
	  var queen = new Card(cardSuit, 10, 'Q');
	  var joker = new Card(cardSuit, 10, 'J');
	  deck.push(ace);
	  deck.push(king);
	  deck.push(queen);
	  deck.push(joker);
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
