var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: Number,
  playerHand: Array,
  dealerHand: Array,
  cardsDeck: Array,
  playerValue: Number,
  dealerValue: Number,
  statusGame: String,
  statusDealer: String,
  statusPlayer: String
  // YOUR CODE HERE
});

GameSchema.statics.newGame = function(item, callback) {
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
  this.suit = suit,
    this.val = val;
  this.syombol = symbol
}

function Deck() {
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  var suit = ['hearts', 'diamonds', 'spades', 'clubs'];
  suit.forEach(function(item, index) {
    for (var i = 1; i <= 13; i++) {
      var symbol, val;
      if (i === 1) {
        symbol = 'A';
        val = 11;
      } else if (i === 11) {
        symbol = 'J';
        val = 10;
      } else if (i === 12) {
        symbol = 'Q';
        val = 10;
      } else if (i === 13) {
        symbol = 'K';
        val = 10;
      } else {
        symbol = i.toString();
        val = i;
      }
      var card = new Card(item, val, symbol);
      this.deck.push(card);
    }
  })
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
}

GameSchema.methods.calcValue = function(hand) {
  // YOUR CODE HERE
}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
};

GameSchema.methods.hit = function() {
  // YOUR CODE HERE
};

GameSchema.methods.stand = function() {
  // YOUR CODE HERE
}

GameSchema.methods.gameOver = function() {
  // YOUR CODE HERE
}

module.exports = mongoose.model('Game', GameSchema);
