var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: Number,
  playerCards: Array,
  dealerCards: Array,
  deck: Array,
  playerTotalVal: Number,
  dealerTotalVal: Number,
  gameStatus: String,
  playerStatus: String,
  dealerStatus: String
});

GameSchema.statics.newGame = function(item, callback) {
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  this.suit = suit;
  this.val = val;
  this.symbol = symbol;
}

function Deck() {
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  var deck = [];
  var suits = {
    0: 'hearts',
    1: 'spades',
    2: 'clubs',
    3: 'diamonds'
  };
  var symbols = {
    0: 'A',
    1: 'K',
    2: 'Q',
    3: 'J'
  };
  var nums = ['2', '3', '4', '5', '6', '7', '8', '9', '10'];
  var deck = this.deck;
  //add the face value cards
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < nums.length; j++) {
      deck.push(new Card(suits[i], j + 2, nums[j]));
    }
  };

  //add the symbol cards
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < symbols.length; j++) {
      if (symbols[j] !== 'A') {
        deck.push(new Card(suits[i], 10, symbols[j]));
      } else {
        deck.push(new Card(suits[i], 11, symbols[j]));
      }
    }
  };
}

Deck.prototype.shuffleDeck = function() {
  var deck = this.deck;
  for (var i = deck.length - 1; i > 0; i--) {
    var index = Math.floor(Math.random() * i);
    //swap
    var tmp = deck[index];
    deck[index] = deck[i];
    deck[i] = tmp;
  }
}

GameSchema.methods.calcValue = function(hand) {
  var totalVal = 0;
  for (var i = 0; i < hand.length; i++) {
    totalVal += hand[i].val;
  }
};

GameSchema.methods.dealInitial = function() {
  this.playerCards.push(this.deck.pop());
  this.playerCards.push(this.deck.pop());
  this.dealerCards.push(this.deck.pop());
  this.dealerCards.push(this.deck.pop());
  this.playerTotalVal = this.calcValue(this.playerCards);
  this.dealerTotalVal = this.calcValue(this.dealerCards);
  this.gameStatus = 'In progress';
};

GameSchema.methods.hit = function() {
  this.playerCards.push(this.deck.pop());
  this.playerTotalVal = this.calcValue(this.playerCards);
  if (this.playerTotalVal > 21) {
    this.playerStatus = 'Lost';
    this.gameOver();
  }
};

GameSchema.methods.stand = function() {
  while (this.dealerTotalVal < 17) {
    this.dealerCards.push(this.deck.pop());
    this.dealerTotalVal = this.calcValue(this.dealerCards);
    if (this.dealerTotalVal > 21) {
      this.dealerStatus = 'Lost';
    }
  }
  this.gameOver();
}

GameSchema.methods.gameOver = function() {
  this.gameStatus = 'Over';
  if (this.playerStatus === 'Lost') {
    this.dealerStatus = 'Won';
  }
  if (this.dealerStatus === 'Lost') {
    this.playerStatus = 'Won';
  }
}

module.exports = mongoose.model('Game', GameSchema);
