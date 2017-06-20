var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: Number,
  cardsInHand: Array,
  cardsInDealerHand: Array,
  cardsInDeck: Array,
  handValue: Number,
  dealerHandValue: Number,
  gameStatus: String,
  playerStatus: String,
  dealerStatus: String
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  return {
    suit: suit,,
    val: val,
    symbol: symbol
  };
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  var deck = [];
  var suits = ["hearts", "diamonds", "spades", "clubs"];
  var values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  var symbols = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  suits.forEach(function(suit) {
    for(var i = 0; i < values.length; i++) {
      deck.push(new Card(suit, values[i], symbols[i]));
    }
  })
  return deck;
}

Deck.prototype.shuffleDeck = function() {
  var array = this.deck;
  for (var i = 0; i < array.length; i++) {
    var randNum = Math.floor(array.length * Math.random());
    var temp = array[randNum];
    array[randNum] = array[i];
    array[i] = temp;
  }
  this.deck = array;
}

GameSchema.methods.calcValue = function(hand){
  val total = 0;
  hand.forEach(function(card) {
    total += card.val;
  })
  return total;
}

GameSchema.methods.dealInitial = function() {
  var hand = [];
  hand.push(this.deck.pop());
  hand.push(this.deck.pop());
  return hand
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
