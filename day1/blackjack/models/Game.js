var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: {
    type: Number,
    default: 0
  },
  playerHand: Array,
  dealerHand: Array,
  deck: Array,
  playerValue: {
    type: Number,
    default: 0
  },
  dealerValue: {
    type: Number,
    default: 0
  },
  gameStatus: {
    type: String,
    enum: ['Not Started', 'Over', 'In Progress'],
    default: 'Not Started'
  },
  playerStatus: {
    type: String,
    enum: ['turnNow', 'waiting', 'won', 'lost', 'draw']
  },
  dealerStatus: {
    type: String,
    enum: ['turnNow', 'waiting', 'won', 'lost', 'draw']
  }
});

GameSchema.statics.newGame = function(item, callback) {
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  return {
    suit: suit,
    val: val,
    symbol: symbol
  };
}

function Deck() {
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  for (var k = 0; k < 4; k++) {
    for (var j = 2; j < 15; j++) {
      var suit;
      var val;
      var symbol;
      switch (k) {
        case 0:
          suit = 'hearts';
          break;
        case 1:
          suit = 'diamonds';
          break;
        case 2:
          suit = 'spades';
          break;
        case 3:
          suit = 'clubs';
          break;
      }

      if (j < 11) {
        symbol = j.toString();
        val = j;
      } else if (j === 12) {
        symbol = 'J'
        val = 10;
      } else if (j === 13) {
        symbol = 'Q'
        val = 10;
      } else if (j === 14) {
        symbol = 'K'
        val = 10;
      } else if (j === 11) {
        symbol = 'A';
        val = j;
      }

      this.deck.push(new Card(suit, val, symbol));
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  for (var k = this.deck.length - 1; k > 0; k--) {
    var index = Math.floor(Math.random() * k);
    var temp = this.deck[index];
    this.deck[index] = this.deck[k];
    this.deck[k] = temp;
  }
}

GameSchema.methods.calcValue = function(hand) {
  var total = 0;
  var cnt = 0;
  hand.forEach(function(card) {
    total += card.val;
    if (card.val === 11)
      cnt++;
  })

  while (cnt > 0) {
    if (total > 21) {
      total -= 10;
      cnt--;
    } else {
      break;
    }
  }

  return total;
}

GameSchema.methods.dealInitial = function() {
  this.playerHand.push(this.deck.pop());
  this.dealerHand.push(this.deck.pop());
  this.playerHand.push(this.deck.pop());
  this.dealerHand.push(this.deck.pop());

  this.gameStatus = 'In Progress';

  this.playerValue = this.calcValue(this.playerHand);
  this.dealerValue = this.calcValue(this.dealerHand);
};

GameSchema.methods.hit = function() {
  this.playerHand.push(this.deck.pop());

  this.playerValue = this.calcValue(this.playerHand);

  if (this.playerValue >= 21)
    this.gameOver();
};

GameSchema.methods.stand = function() {
  while (this.dealerValue < 17) {
    this.dealerHand.push(this.deck.pop());
    this.dealerValue = this.calcValue(this.dealerHand);
  }

  this.gameOver();
}

GameSchema.methods.gameOver = function() {
  this.gameStatus = 'Over';

  if (this.playerValue > this.dealerValue) {
    if (this.playerValue < 22) {
      this.playerStatus = 'won';
      this.dealerStatus = 'lost';
    } else {
      this.playerStatus = 'lost';
      this.dealerStatus = 'won';
    }
  } else if (this.playerValue < this.dealerValue) {
    if (this.dealerValue < 22) {
      this.playerStatus = 'lost';
      this.dealerStatus = 'won';
    } else {
      this.playerStatus = 'won';
      this.dealerStatus = 'lost';
    }
  } else {
    this.playerStatus = 'draw';
    this.dealerStatus = 'draw';
  }
}

module.exports = mongoose.model('Game', GameSchema);