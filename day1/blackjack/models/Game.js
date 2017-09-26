var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: {
    type: Number,
    required: true,
  },
  playerHand: {
    type: Array,
    required: true,
  },
  dealerHand: {
    type: Array,
    required: true,
  },
  deck: {
    type: Array,
    required: true,
  },
  playerValue: {
    type: Number,
    required: true,
    default: 0,
  },
  dealerValue: {
    type: Array,
    required: true,
    default: 0,
  },
  gameStatus: {
    type: String,
    required: true,
  },
  playerStatus: {
    type: String,
    required: true,
  },
  dealerStatus: {
    type: String,
    required: true,
  },
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  this.suit = suit;
  this.val = val;
  this.symbol = symbol; // make number symbols strings for simplicity
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  const suits = ['diamonds', 'clubs', 'hearts', 'spades'];
  const symbols = [
    {symbol: 2, value: 2},
    {symbol: 3, value: 3},
    {symbol: 4, value: 4},
    {symbol: 5, value: 5},
    {symbol: 6, value: 6},
    {symbol: 7, value: 7},
    {symbol: 8, value: 8},
    {symbol: 9, value: 9},
    {symbol: 10, value: 10},
    {symbol: 'J', value: 10},
    {symbol: 'Q', value: 10},
    {symbol: 'K', value: 10},
    {symbol: 'A', value: 11},
  ];
  for(var i in suits) {
    for(var j in symbols) {
      this.deck.push(new Card(suits[i], symbols[j].value, symbols[j].symbol));
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
