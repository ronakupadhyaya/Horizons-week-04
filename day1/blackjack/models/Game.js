var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: {
    type: Number
  },
  playerCards: {
    type: Array
  },
  dealerCards: {
    type: Array
  },
  deckCards: {
    type: Array
  },
  playerValue: {
    type: Number
  },
  dealerValue: {
    type: Number
  },
  status: {
    type: String
  },
  statusPlayer: {
    type: String
  },
  statusDealer: {
    type: String
  }
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item);
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
  var suits = ["Spades", "Clubs", "Diamonds", "Hearts"];
  var vals = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
  var symbols = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < vals.length; j++) {
      var newCard = new Card(suits[i], vals[j], symbols[j]);
      this.deck.push(newCard);
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  var usedValues = {};
  var currentDeck = this.deck;
  var shuffledDeck = [];
  while (this.deck.length !== 0) {
    var newVal = Math.floor(Math.random() * (this.deck.length - 1)) + 1;
    shuffledDeck.push(this.deck[newVal]);
    this.deck.splice(newVal - 1, 1);   
  }
  this.deck = shuffledDeck;
}

GameSchema.methods.calcValue = function(hand){
  var value = 0;
  for (var i = 0; i < hand.length; i++) {
    value += hand[i].val;
  }
  return value;
}

GameSchema.methods.dealInitial = function() {
  
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