var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  playerBet: {
    type: Number, 
    default: 0
  },
  currentPlayerHand: Array,
  currentDealerHand: Array,
  deck: Array,
  userHandTotal: {
    type: Number, 
    default: 0
  },
  dealerHandTotal: {
    type: Number, 
    default: 0
  },
  status: {
    type: String, 
    default: "Not Started"
  },
  userStatus: {
    type: String, 
    default: "waiting"
  },
  dealerStatus: {
    type: String, 
    default: "waiting"
  }  
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
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