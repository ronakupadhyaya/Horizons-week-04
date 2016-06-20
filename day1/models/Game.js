var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  deck: [],
  status: {type: String, default: 'Not Started'},
  player1bet: {type: Number, default: 0},
  userTotal: {type: Number, default: 0},
  dealerTotal: {type: Number, default: 0},
  userStatus: {type: String, default: "waiting"},
  dealerStatus: {type: String, default: "waiting"},
  currentPlayerHand: [],
  houseHand: [],
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

GameSchema.statics.deal21 = function(game) {
  // YOUR CODE HERE
};

GameSchema.statics.calcValue = function(hand){
  // YOUR CODE HERE
}

GameSchema.statics.hit = function(game){
  // YOUR CODE HERE
};

GameSchema.statics.stand = function stand(game){
  // YOUR CODE HERE
}

GameSchema.statics.gameOver = function gameOver(game){
  // YOUR CODE HERE
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

module.exports = mongoose.model('Game', GameSchema);