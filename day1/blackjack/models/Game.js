var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  preGameBet: {
    type: Number,
    default: 0
  },
  playerHand: {
    type: Array
  },
  dealerHand: {
    type: Array
  },
  deck: {
    type: Array
  },
  playerTotalValue: {
    type: Number,
    default: 0
  },
  dealerTotalValue: {
    type: Number,
    default: 0
  },
  gameStatus: {
    type: String,
    default: "Not Started"
  },
  playerStatus: {
    type: String
  },
  dealerStatus: {
    type: String
  }
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

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  var values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
  var suits = ['spades', 'clubs', 'diamonds', 'hearts'];
  var symbols = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  this.deck = [];
  for(var i = 0; i < values.length; i++) {
    for(var j = 0; j < suits.length; j++) {
      var card = new Card(suits[j], values[i], symbols[i]);
      this.deck.push(card);
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  var curDeck = this.deck;
  for (var i = array.length - 1; i > 0; i--) {
    var index = Math.floor(Math.random() * i);
    //swap
    var tmp = curDeck[index];
    curDeck[index] = curDeck[i];
    curDeck[i] = tmp;
  }
  this.deck = curDeck;
}

GameSchema.methods.calcValue = function(hand){
  console.log('inside calc value')
  var total = 0;
  // SORTED
  hand.sort(function(a, b) {
    return a.val - b.val;
  });
  for(var i = 0; i < hand.length; i++) {
    if(hand[i].symbol === "A" && total > 10) {
      hand[i].val = 1;
      total += hand[i].val;
    } else {
      total += hand[i].val;
    }
    return total;
  }
}

GameSchema.methods.dealInitial = function() {
  this.gameStatus = "In Progress";
  var playerCardOne = this.deck.shift();
  var dealerCardOne = this.deck.shift();
  var playerCardTwo = this.deck.shift();
  var dealerCardTwo = this.deck.shift();
  this.playerHand.push(playerCardOne);
  this.playerHand.push(playerCardTwo);
  this.dealerHand.push(dealerCardOne);
  this.dealerHand.push(dealerCardTwo);
  this.playerTotalValue = calcValue(this.playerHand);
  this.dealerTotalValue = calcValue(this.dealerHand);
  if(this.playerTotalValue === 21 || this.dealerTotalValue === 21) {
    this.gameOver();
  }
};

GameSchema.methods.hit = function(){
  var playerHit = this.deck.shift();
  this.playerHand.push(playerHit);
  this.playerTotalValue = calcValue(this.playerHand);
  if(this.playerTotalValue > 21) {
    // this.gameStatus = "Over";
    // this.playerStatus = "Win";
    // this.dealerStatus = "Loss";
    this.gameOver();
  }
  // else {
  //   this.gameStatus = "In Progress";
  // }
};

GameSchema.methods.stand = function(){
  this.dealerTotalValue = calcValue(this.dealerHand);
  while(this.dealerTotalValue < 17) {
    dealerHit = this.deck.shift();
    this.dealerHand.push(dealerHit);
    this.dealerTotalValue = calcValue(this.dealerHand);
  }
  this.gameOver();
}

GameSchema.methods.gameOver = function(){
  this.gameStatus = "Over";
  this.playerTotalValue = calcValue(this.playerHand);
  this.dealerTotalValue = calcValue(this.dealerHand);
  if(this.playerTotalValue > 21) {
    this.playerStatus = "Loss";
    this.dealerStatus = "Win";
  } else if (this.dealerTotalStatus > 21){
    this.dealerStatus = "Loss";
    this.playerStatus = "Win";
  } else if(this.playerTotalValue === 21 && this.dealerTotalValue !== 21) {
    this.playerStatus = "Win";
    this.dealerStatus = "Loss";
  } else if (this.playerTotalValue !== 21 && this.dealerTotalValue === 21){
    this.playerStatus = "Loss";
    this.dealerStatus = "Win";
  } else if (this.playerTotalValue === 21 && this.dealerTotalValue === 21){
    this.playerStatus = "Tied";
    this.dealerStatus = "Tied";
  } else if (this.playerTotalValue < this.dealerTotalValue) {
    this.playerStatus = "Loss";
    this.dealerStatus = "Win";
  } else if (this.playerTotalValue > this.dealerTotalValue){
    this.playerStatus = "Win";
    this.dealerStatus = "Loss";
  } else {
    this.gameStatus = "Over--Tie";
    this.playerStatus = "Tied";
    this.dealerStatus = "Tied";
  }
}

module.exports = mongoose.model('Game', GameSchema);
