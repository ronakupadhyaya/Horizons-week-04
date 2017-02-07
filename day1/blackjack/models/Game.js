var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: {
    type: Number
  },
  playersCards:{
    type: [] //REVISIT!!!DGDSGDSHDSHSHD
  },
  dealersCards:{
    type:[]
  },
  deckCards:{
    type:[]
  },
  playersValue:{
    type: Number
  },
  dealersValue:{
    type: Number
  },
  gameStatus:{
    type:String
  },
  playerStatus:{
    type:String
  },
  dealerStatus:{
    type:String
  }
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
