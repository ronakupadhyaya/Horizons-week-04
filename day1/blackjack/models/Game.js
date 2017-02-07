var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  betPlayer: {
    type: Number,
  },
  // currentCards: {
  //   type: Array,
  //   default: [0]
  // },
  dealerCards: {
    type: Array,
  },
  cardsindeck: {
    type: Array
  },
  totalValplayer: {
    type: Number,
    default: 0
  },
  totalValdealer: {
    type: Number,
    default: 0
  },
  gameStatus: {
    type: String
  },
  playerStatus: {
    type: String
  },
  dealerStatus: {
    type: String
  }
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  suit: suit,
  val: val,
  symbol: symbol
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
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
