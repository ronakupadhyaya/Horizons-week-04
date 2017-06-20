var mongoose = require('mongoose');
var shuffle = require('shuffle-array');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  bet_amount: Number,
  cards_player: Array,
  cards_dealer: Array,
  cards_deck: Array,
  hand_value_player: Number,
  hand_value_dealer: Number, 
  status_game: String,
  status_player: String,
  status_dealer: String
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
  var suits = ["hearts", "diamonds", "spades", "clubs"];
  var vals = [10, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  var symbols = ["A", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  for (var i=0; i<4; i++) {
    for (var j=0; j<13; j++) {
      var newCard = new Card(suits[i], vals[j], symbols[j]);
      this.deck.push(newCard);
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  shuffle(this.deck);
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