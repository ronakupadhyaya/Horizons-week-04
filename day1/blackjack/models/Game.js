var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  deck: Array,
  status: {
    type: String,
    default: "Not Started"
  },
  playerBet: {
    type: Number,
    default: 0
  },
  userTotal: {
    type: Number,
    default: 0
  },
  dealerTotal: {
    type: Number,
    default: 0
  },
  userStatus: {
    type: String,
    default: "waiting"
  },
  dealerStatus: {
    type: String,
    default: "waiting"
  },
  currentPlayerHand: Array,
  houseHand: Array
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
  var suits = {
    0: "hearts",
    1: "spades",
    2: "clubs",
    3: "diamonds"
  };
  var faces = {
    11: "J",
    12: "Q",
    13: "K",
    14: "A"
  };
  for (var i in suits) {
    for (var j = 2; j <= 13; j++) {
      if (j > 10) this.deck.push(new Card(suits[i], 10, faces[j]));
      else this.deck.push(new Card(suits[i], j, String(j)));
    }
    this.deck.push(new Card(suits[i], 11, "A"));
  }
}
Deck.prototype.shuffleDeck = function() {
  var remaining = this.deck.length;
  while (remaining > 0) {
    var i = Math.floor(Math.random() * remaining--);
    var j = this.deck[remaining];
    this.deck[remaining] = this.deck[i];
    this.deck[i] = j;
  }
}

GameSchema.methods.calcValue = function(hand) {
  return hand.sort(function(a, b) {
    return a.val - b.val;
  }).reduce(function(prev, cur) {
    console.log(cur)
    if (cur.symbol !== "A") return prev + cur.val;
    else if (prev >= 11) return prev + 1;
    else return prev + 11;
  }, 0);
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