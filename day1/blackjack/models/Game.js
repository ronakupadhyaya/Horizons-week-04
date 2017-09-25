var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: Number,
  hand: Array,
  dealer: Array,
  deck: Array,
  handval: {
    type: Number,
    default: 0
  },
  dealerval: {
    type: Number,
    default: 0
  },
  gamestatus: {
    type: String,
    default: "Not Started"
  },
  handstatus: String,
  dealerstatus: String
});

GameSchema.statics.newGame = function(item, callback) {
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  val: Number,
  suit: String,
  symbol: String
}

function Deck() {
  this.deck = [];
  this.createDeck().bind(this)
  this.shuffleDeck().bind(this)
  return this.deck;
}

Deck.prototype.createDeck = function() {
  var suits = ['hearts', 'clubs', 'diamonds', 'spades'];
  var symbols = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  var vals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; i < symbols.length; i++) {
      this.deck.push(new Card(suits[i], vals[j], symbols[j]))
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  this.sort(function(a, b) {
    return Math.random - 0.5
  })
}

GameSchema.methods.calcValue = function(hand) {
  var total = 0;
  var hasAce = false;
  hand.forEach(function(card) {
    total += card.val
    if (card.symbol === "A") {
      hasAce = true;
    }
  })
  if (total > 21 && hasAce === true) {
    total -= 10
  }
  return total
}

GameSchema.methods.dealInitial = function() {
  hand.concat(this.deck.splice(0, 2));
  dealer.concat(this.deck.splice(0, 2));
  this.gamestatus = 'Started';
  this.handstatus = 'In progress';
  this.dealerstatus = 'In progress';
  this.handval = this.calcValue(this.hand);
  this.dealerval = this.calcValue(this.dealer);
};

GameSchema.methods.hit = function() {
  this.hand.concat(this.deck.splice(0, 1));
  this.handval = this.calcValue(this.hand);
  if (this.handval > 21) {
    gameOver();
  }
};

GameSchema.methods.stand = function() {
  while (this.dealerval < 17) {
    this.dealer.concat(this.deck.splice(0, 1));
    this.dealerval = this.calcValue(this.dealer);
  }
  gameOver();
}

GameSchema.methods.gameOver = function() {
  this.status = "Over";
  this.handstatus = this.handval > 21 ? "Bust" : "Stand";
  this.dealerstatus = this.dealerval > 21 ? "Bust" : "Stand";
  if (this.handstatus === this.dealerstatus === "Stand") {
    this.handstatus = this.hanval > this.dealerval ? "Win" : "Lose";
    this.dealerstatus = this.hanval < this.dealerval ? "Win" : "Lose";
  }
}

module.exports = mongoose.model('Game', GameSchema);
