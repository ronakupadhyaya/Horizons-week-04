var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  playerBet: {
    type: number,
    default: 0
  },
  playerCards: Array,
  dealerCards: Array,
  CardsinDeck: array,
  playerBet: {
    type: number,
    default: 0
  }

  Playervalue: {
    type: number,
    default: 0
  }

  dealerValue: {
    type: number,
    default: 0
  }
  GameStatus: {
    type: string,
    default: "Not Started"
  }
  playerStatus: string,
  dealerStatus: string
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {


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