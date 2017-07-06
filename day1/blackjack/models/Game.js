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
  var cardObj = {
    suit: suit,
    val: val,
    symbol: symbol
  };
  return cardObj;
}

function Deck() {
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  for (var i = 0; i < 4; i++) {
    for (var k = 2; k < 15; k++) {
      var suit;
      var val;
      var symbol;
      switch (i) {
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

      if (k < 11) {
        symbol = k.toString();
        val = k;
      } else if (k === 11) {
        symbol = 'A';
        val = k;
      } else if (k === 12) {
        symbol = 'J';
        val = 10;
      } else if (k === 13) {
        symbol = 'Q';
        val = 10;
      } else if (k === 14) {
        symbol = 'K';
        val = 10;
      }

      this.deck.push(new Card(suit, val, symbol));
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  for (var i = this.deck.length; i > 0; i--) {
    var index = Math.floor(Math.random() * i);
    var tmp = this.deck[index];
    this.deck[index] = this.deck[i];
    this.deck[i] = tmp;
  }
}

GameSchema.methods.calcValue = function(hand) {
  var total = 0;
  var aceCount = 0
  hand.forEach(function(card) {
    total += card.val;
    if (card.val === 11) {
      aceCount++;
    }
  });

  while (aceCount > 0) {
    if (total > 21) {
      total -= 10;
      aceCount--;
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

  if (this.playerValue >= 21) {
    this.gameOver();
  }
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
      this.dealerStatus = 'won';
      this.playerStatus = 'lost';
    } else {
      this.dealerStatus = 'lost';
      this.playerStatus = 'won';
    }
  } else {
    this.playerStatus = 'draw';
    this.dealerStatus = 'draw';
  }
}

module.exports = mongoose.model('Game', GameSchema);
