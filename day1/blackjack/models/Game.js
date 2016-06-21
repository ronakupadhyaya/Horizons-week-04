var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: Number,
  playerHand: Array,
  dealerHand: Array,
  deck: Array,
  playerHandValue: {
    type: Number,
    default: 0,
  },
  dealerHandValue: {
    type: Number,
    default: 0,
  },
  gameStatus: {
    type: String,
    default: 'Not Started',
  },
  playerStatus: String,
  dealerStatus: String,
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  this.suit = suit;
  this.val = val;
  this.symbol = symbol; // 'A', 'K', 'Q', 'J', '10', '9'...
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  var suits = ["hearts", "diamonds", "spades", "clubs"];
  var vals = [11, 10, 10, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  var symbols = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < vals.length; j++) {
      var card = new Card(suits[i], vals[j], symbols[j]);
      this.deck.push(card);
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  for (var i = this.deck.length - 1; i > 0; i--) {
    var index = Math.floor(Math.random() * i);

    var tmp = this.deck[index];
    this.deck[index] = this.deck[i];
    this.deck[i] = tmp;
  }
}

GameSchema.methods.calcValue = function(hand){
  var countAce = function(hand) {
    var res = 0;
    for (var i in hand) {
      if (hand[i].symbol == 'A') {
        res++;
      }
    }
    return res;
  };
  var aceCount = countAce(hand);
  var res = hand.reduce(function(prev, curr) {
    if (curr.symbol != 'A') {
      return prev + curr.val;
    } else if (prev >= 11) {
      return prev + 1;
    } else {
      return prev + 11;
    }
  });
  while (aceCount > 0 && res > 21) {
    res = res - 10;
    aceCount--;
  }
  return res;
}

GameSchema.methods.dealInitial = function() {
  this.playerHand.push(this.deck.pop());
  this.playerHand.push(this.deck.pop());
  this.dealerHand.push(this.deck.pop());
  this.dealerHand.push(this.deck.pop());
  this.playerHandValue = this.calcValue(this.playerHand);
  this.dealerHandValue = this.calcValue(this.dealerHand);
  this.playerStatus = 'Playing';
  this.dealerStatus = 'Playing';
  this.gameStatus = 'In Progress';
};

GameSchema.methods.hit = function(){
  this.playerHand.push(this.deck.pop());
  this.playerHandValue = this.calcValue(this.playerHand);
  if (this.playerHandValue > 21) {
    this.gameOver();
  }
};

GameSchema.methods.stand = function(){
  while (this.dealerHandValue < 17) {
    this.dealerHand.push(this.deck.pop());
    this.dealerHandValue = this.calcValue(this.dealerHand);
  }
  this.gameOver();
}

GameSchema.methods.gameOver = function(){
  if (this.playerHandValue > 21) {
    this.playerStatus = 'Lost';
    this.dealerStatus = 'Won';
  } else if (this.dealerHandValue > 21) {
    this.playerStatus = 'Won';
    this.dealerStatus = 'Lost';
  } else if (this.playerHandValue > this.dealerHandValue) {
    this.playerStatus = 'Won';
    this.dealerStatus = 'Lost';
  } else {
    this.playerStatus = 'Lost';
    this.dealerStatus = 'Won';
  }
  this.gameStatus = 'Over';
}

module.exports = mongoose.model('Game', GameSchema);
