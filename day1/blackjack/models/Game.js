var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  preGameBet: {
    type: Number
  },
  playerHand: {
    type: Array
  },
  dealerHand: {
    type: Array // ******
  },
  cardsInDeck: {
    type: Array // ******
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
  return this.deck;
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
  return curDeck;
}

GameSchema.methods.calcValue = function(hand){
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
  this.playerHand.push(playerCardOne);
  this.dealerHand.push(dealerCardOne);
  this.dealerHand.push(dealerCardTwo);
  this.playerTotalValue = calcValue(playerHand);
  this.dealerTotalValue = calcValue(dealerHand);
  if(playerTotalValue === 21 && dealerTotalValue < 21) {
    this.gameStatus = "Over";
    this.playerStatus = "Win";
    this.dealerStatus = "Loss";
    this.gameOver();
  } else if (playerTotalValue < 21 && dealerTotalValue === 21){
    this.gameStatus = "Over";
    this.playerStatus = "Loss";
    this.dealerStatus = "Win";
    this.gameOver();
  } else if (playerTotalValue === 21 && dealerTotalValue === 21){
    this.gameStatus = "Over";
    this.playerStatus = "Tied";
    this.dealerStatus = "Tied";
    this.gameOver();
  } else if (playerTotalValue < dealerTotalValue) {
    this.playerStatus = "Losing";
    this.dealerStatus = "Winning";
  } else if (playerTotalValue > dealerTotalValue){
    this.playerStatus = "Winning";
    this.dealerStatus = "Losing";
  } else {
    this.gameStatus = "Over--Tie";
    this.playerStatus = "Tied";
    this.dealerStatus = "Tied";
    this.gameOver();
  }
};

GameSchema.methods.hit = function(){
  var playerHit = this.deck.shift();
  this.playerHand.push(playerHit);
  this.playerTotalValue = calcValue(playerHand);
  if(this.playerTotalValue === 21) {
    this.gameStatus = "Over";
    this.playerStatus = "Win";
    this.dealerStatus = "Loss";
    this.gameOver();
  } else {
    this.gameStatus = "In Progress";
  }
};

GameSchema.methods.stand = function(){
  var dealerHit = this.deck.shift();
  this.dealerHand.push(dealerHit);
  this.dealerTotalValue = calcValue(dealerHand);
  while(this.dealerTotalValue < 17) {
    dealerHit = this.deck.shift();
    this.dealerHand.push(dealerHit);
    this.dealerTotalValue = calcValue(dealerHand);
  }
  this.gameStatus = "Over";
  this.gameOver();
}

GameSchema.methods.gameOver = function(){
  this.gameStatus = "Over";
  
}

module.exports = mongoose.model('Game', GameSchema);
