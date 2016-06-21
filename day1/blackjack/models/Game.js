var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  bet: Number,
  dealerHand: [],
  cardDeck: [],
  playerHandVal: {
    type: Number,
    default: 0;
  },
  dealerHandVal:{
    type: Number,
    default: 0;
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
  var suits = ["hearts", "diamonds", "spades", "clubs"]
  var vals = [1,2,3,4,5,6,7,8,9,10,10,10,10,11]
  var symbols = ['1','2','3','4','5','6','7','8','9','10','J','Q','K','A']

  for(var i = 0; i < suits.length; i++ ){ }
  for( var i = 0; i < 52; i++){
    this.deck.push(i);
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
