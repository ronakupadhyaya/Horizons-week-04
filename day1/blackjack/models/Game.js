var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  bet: Number,
  playerHand: Array,
  dealerHand: Array,
  deck: Array,
  playerHandValue: { type: Number, default: 0 },
  dealerHandValue: { type: Number, default: 0 },
  gameStatus: { type: String, enum: ["Not Started", "Over", "In Progress"], default: "Not Started" },
  playerStatus: String,
  dealerStatus: String
});

GameSchema.statics.newGame = function (item, callback) {
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  // YOUR CODE HERE
  this.suit = suit;
  this.val = val;
  this.symbol = symbol;
  return this;
}

function Deck() {
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function () {
  // YOUR CODE HERE
  var symbols = ['J', 'Q', 'K', 'A'];
  var suits = ["hearts", "diamonds", "spades", "clubs"];
  suits.forEach(function (s) {
    for (let i = 0; i < 10; i++) {
      this.deck.push(new Card(s, i, i));
    }
    symbols.forEach(function (n) {
      if (n === 'A') {
        this.deck.push(new Card(s, 11, n));
      } else {
        this.deck.push(new Card(s, 10, n));
      }
    });
  })

}

Deck.prototype.shuffleDeck = function () {
  // YOUR CODE HERE
  for (let i = 0; i < this.deck.length - i; i++) {
    var temp = this.deck[i];
    this.deck[i] = this.deck[this.deck.length - i];
    this.deck[this.deck.length - i] = temp;
  }
}

GameSchema.methods.calcValue = function (hand) {
  // YOUR CODE HERE
  var numAces = 0;
  var total = 0;
  hand.forEach(function (n) {
    if (n.symbol === 'A') {
      numAces++;
    } else {
      total += n.val;
    }
  });
  for (let i = 0; i < numAces; i++) {
    if (total + (numAces * 11) <= 21) {
      total += 11;
      numAces--;
    } else {
      total += 1;
      numAces--;
    }
  }
  return total;
}

GameSchema.methods.dealInitial = function () {
  // YOUR CODE HERE

  // deal cards
  for (let i = 0; i < 2; i++) {
    this.playerHand.push(this.deck.pop());
    this.dealerHand.push(this.deck.pop());
  }

  // update values
  this.playerHandValue = this.calcValue(this.playerHand);
  this.dealerHandValue = this.calcValue(this.dealerHand);

  // player and dealer status
  if (this.playerHandValue > 21) {
    this.playerStatus = "Lost";
  } else if (this.playerHandValue === 21) {
    this.playerStatus = "Won";
  } else {
    this.playerStatus = "In Progress";
  }

  if (this.dealerHandValue > 21) {
    this.dealerStatus = "Lost";
  } else if (this.dealerHandValue === 21) {
    this.dealerStatus = "Won";
  } else {
    this.dealerStatus = "In Progress";
  }
  // game status
  if (this.playerStatus !== "In Progress" || this.dealerStatus !== "In Progress") {
    this.gameStatus = "Over";
  } else {
    this.gameStatus ="In Progress";
  }
};

GameSchema.methods.hit = function () {
  // YOUR CODE HERE
  this.playerHand.push(this.deck.pop());
  this.playerHandValue = this.calcValue(this.playerHand);
  
  if (this.playerHandValue > 21) {
    this.playerStatus = "Lost";
  } else if (this.playerHandValue === 21) {
    this.playerStatus = "Won";
  } else {
    this.playerStatus = "In Progress";
  }

  if (this.playerStatus !== "In Progress" || this.dealerStatus !== "In Progress") {
    this.gameStatus = "Over";
    gameOver();
  }
};

GameSchema.methods.stand = function () {
  // YOUR CODE HERE
  while(this.dealerHandValue < 17) {
    this.dealerHand.push(this.deck.pop());
    this.dealerHandValue = this.calcValue(this.dealerHand);
  }

  if (this.dealerHandValue > 21) {
    this.dealerStatus = "Lost";
  } else if (this.dealerHandValue === 21) {
    this.dealerStatus = "Won";
  } else {
    this.dealerStatus = "In Progress";
  }

  this.gameStatus = "Over";

  gameOver();
}

GameSchema.methods.gameOver = function () {
  // YOUR CODE HERE
  this.gameStatus = "Over";

  if (this.playerStatus === "Won" && this.dealerStatus === "Won") {
    this.playerStatus = "Tie";
    this.dealerStatus = "Tie";
  } else if (this.playerStatus === "Won") {
    this.dealerStatus = "Lost";
  } else if (this.dealerStatus === "Won") {
    this.playerStatus = "Lost";
  } else {
    if (this.playerHandValue > this.dealerHandValue) {
      this.playerStatus = "Won";
    } else if (this.dealerHandValue > this.playerHandValue) {
      this.dealerStatus = "Won";
    } else {
      this.playerStatus = "Tie";
      this.dealerStatus = "Tie";
    }
  }
}

module.exports = mongoose.model('Game', GameSchema);