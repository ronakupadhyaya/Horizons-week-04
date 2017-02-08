var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  bet: {
    type: Number,
    default: 0
  },
  playerCards: Array,
  dealerCards: Array,
  deck: Array,
  playerTotal: {
    type: Number,
    default: 0
  },
  dealerTotal: {
    type: Number,
    default: 0
  },
  gameStatus: {
    type: String,
    default: "Not Started"
  },
  playerStatus: String,
  dealerStatus: String
});

GameSchema.statics.newGame = function(item, callback){
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  this.suit = suit;
  this.val = val;
  this.symbol = symbol;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  var suits = ['hearts','diamonds','clubs','spades'];
  var vals = [11,2,3,4,5,6,7,8,9,10,10,10,10];
  var symbols = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  for(var i = 0; i < suits.length; i++) {
    for(var j = 0; j < vals.length; j++) {
      var card = new Card(suits[i], vals[j], symbols[j]);
      this.deck.push(card);
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var shuffledDeck = [];

  while(this.deck.length) {
    shuffledDeck.push(this.deck.splice(getRandomInt(0, this.deck.length), 1)[0])
  }

  this.deck = shuffledDeck;
}

function Deck() {
  this.deck = [];
  this.createDeck();
  this.shuffleDeck();
  return this.deck;
}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
  var total = 0;

  hand.sort(function(a,b) {
    return a.val-b.val;
  })

  for(var i = 0; i < hand.length; i++) {
    if(hand[i].symbol === 'A' && total > 10) {
      hand[i].val = 1;
      total += hand[i].val;
    } else {
      total += hand[i].val;
    }
  }
  return total;
}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
  this.gameStatus = 'In Progress';
  this.playerCards.push(this.deck.shift());
  this.dealerCards.push(this.deck.shift());
  this.playerCards.push(this.deck.shift());
  this.dealerCards.push(this.deck.shift());
  this.playerTotal = this.calcValue(this.playerCards);
  this.dealerTotal = this.calcValue(this.dealerCards);
  if(this.playerTotal === 21 || this.dealerTotal === 21) {
    // this.playerStatus = 'Won';
    // this.dealerStatus = 'Lost';
    this.gameOver();
  }
  // } else if(this.dealerTotal < this.playerTotal && this.dealerTotal === 21) {
  //   this.playerStatus = 'Lost';
  //   this.dealerStatus = 'Won';
  //   this.gameOver();
  // } else if(this.playerTotal === 21 && this.dealerTotal === 21) {
  //   this.playerStatus = 'Tied';
  //   this.dealerStatus = 'Tied';
  //   this.gameOver();
  // } else if(this.playerTotal > this.dealerTotal) {
  //   this.playerStatus = 'Winning';
  //   this.dealerStatus = 'Losing';
  // } else if(this.playerTotal < this.dealerTotal) {
  //   this.playerStatus = 'Losing';
  //   this.dealerStatus = 'Winning';
  // } else if(this.playerTotal === this.dealerTotal) {
  //   this.playerStatus = 'Tied';
  //   this.dealerStatus = 'Tied';
  // }
};

GameSchema.methods.hit = function(){
  // YOUR CODE HERE
  this.playerCards.push(this.deck.shift());
  this.playerTotal = this.calcValue(this.playerCards);
  if(this.playerTotal > 21) {
    // this.playerStatus = 'Won';
    // this.dealerStatus = 'Lost';
    this.gameOver();
  }
  // } else if(this.playerTotal > this.dealerTotal) {
  //   this.playerStatus = 'Winning';
  //   this.dealerStatus = 'Losing';
  // } else if(this.playerTotal < this.dealerTotal) {
  //   this.playerStatus = 'Losing';
  //   this.dealerStatus = 'Winning';
  // } else if(this.playerTotal === this.dealerTotal) {
  //   this.playerStatus = 'Tied';
  //   this.dealerStatus = 'Tied';
  // }
};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
  this.dealerTotal = this.calcValue(this.dealerCards);
  while(this.dealerTotal < 17) {
    this.dealerCards.push(this.deck.shift());
    this.dealerTotal = this.calcValue(this.dealerCards);
  }
  this.gameOver();
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
  this.gameStatus = "Over";
  this.playerTotal = calcValue(this.playerCards);
  this.dealerTotal = calcValue(this.dealerCards);
  if(this.playerTotal > 21) {
    this.playerStatus = "Lost";
    this.dealerStatus = "Won";
  } else if(this.dealerTotal > 21) {
    this.playerStatus = "Won";
    this.dealerStatus = "Lost";
  } else if (this.playerTotal === 21 && this.dealerTotal !== 21) {
   this.playerStatus = "Won";
   this.dealerStatus = "Lost";
  } else if (this.playerTotal !== 21 && this.dealerTotal === 21){
   this.playerStatus = "Lost";
   this.dealerStatus = "Won";
  } else if (this.playerTotal === 21 && this.dealerTotal === 21){
   this.playerStatus = "Tied";
   this.dealerStatus = "Tied";
  } else if (this.playerTotal < this.dealerTotal) {
   this.playerStatus = "Lost";
   this.dealerStatus = "Won";
  } else if (this.playerTotal > this.dealerTotal){
   this.playerStatus = "Won";
   this.dealerStatus = "Lost";
  }
}

module.exports = mongoose.model('Game', GameSchema);
