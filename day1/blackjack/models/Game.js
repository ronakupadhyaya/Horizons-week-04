var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  playerBet: Number,
  currentPlayerHand: Array,
  houseHand: Array,
  deck: Array,
  userTotal: {type: Number, default: 0},
  dealerTotal: {type: Number, default: 0},
  status: {type: String, default: 'Not Started'},
  userStatus: {type: String, default: 'waiting'},
  dealerStatus: {type: String, default: 'waiting'}
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
  var suits = ['clubs', 'hearts', 'spades', 'diamonds'];
  var symbols = ['J', 'Q', 'K'];
  for (var i = 0; i < suits.length; i++) {
    this.deck.push(new Card(suits[i], 11, 'A'))
    for (var j = 2; j < 11; j++) {
      this.deck.push(new Card(suits[i], j, String([j])))
    }
    for (var k = 0; k < symbols.length; k++) {
      this.deck.push(new Card(suits[i], 10, symbols[k]))
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  for (var i = this.deck.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = this.deck[i];
    this.deck[i] = this.deck[j]
    this.deck[j] = temp;
  }
  return this.deck;
}

GameSchema.methods.calcValue = function(hand){
  var currentValue = 0;
  var aceCount = 0;
  for (var i = 0; i < hand.length; i++) {
    if (hand[i].symbol !== 'A') {
      currentValue += hand[i].val;
    } else {
      aceCount++;
    }
  }
  for (var j = 0; j < aceCount; j++) {
    if (currentValue + 11 > 21) {
      currentValue += 1;
    } else {
      currentValue += 11;
    }
  }
  return currentValue;
}

GameSchema.methods.dealInitial = function() {
  this.currentPlayerHand.push(this.deck.pop());
  this.currentPlayerHand.push(this.deck.pop());
  this.houseHand.push(this.deck.pop());
  this.houseHand.push(this.deck.pop());
  this.userTotal = this.calcValue(this.currentPlayerHand);
  this.dealerTotal = this.calcValue(this.houseHand);
  this.status = "In Progress"
};

GameSchema.methods.hit = function(){
  this.currentPlayerHand.push(this.deck.pop());
  this.userTotal = this.calcValue(this.currentPlayerHand);
  if (this.userTotal > 21) {
    this.userStatus = "Lost";
    this.gameOver();
  }
};

GameSchema.methods.stand = function(){
  while (this.dealerTotal < 17) {
    this.houseHand.push(this.deck.pop());
    this.dealerTotal = this.calcValue(this.houseHand);
  }
  if (this.dealerTotal > 21) {
    this.dealerStatus = "Lost";
  }
  this.gameOver();
}

GameSchema.methods.gameOver = function(){
  this.status = "Over";
  if (this.userStatus === "Lost") {
    this.dealerStatus = "Won";
  } else if (this.dealerStatus === "Lost") {
    this.userStatus = "Won";
  } else if (this.dealerTotal > this.userTotal) {
    this.dealerStatus = "Won";
    this.userStatus = "Lost";
  } else {
    this.dealerStatus = "Lost";
    this.userStatus = "Won";
  }
}

module.exports = mongoose.model('Game', GameSchema);
