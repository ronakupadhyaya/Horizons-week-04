var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
    bet: Number,
    playerHand: [],
    dealerHand: [],
    playerVal: {
      type: Number,
      default: 0
    },
      type: Number,
      default: 0
    },
    gameStatus: {
      type: String,
      default: "Not Started"
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
  var cards = [];
  var suits = ["hearts", "diamonds", "spades","clubs"];
  for (var i = 2; i < 15; i++) {
    for (var i = 0; i < 4; i++) {

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