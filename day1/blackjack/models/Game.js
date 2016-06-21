var mongoose = require('mongoose');
var _=require('underscore')

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  playerBet: Number,
  playerHand: [],
  dealerHand: [],
  deck: [],
  playerScore: {
    type: Number,
    default: 0,
  },
  dealerScore: {
    type: Number,
    default: 0,
  },
  status: {
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
  this.suit = suit
  this.val = val
  this.symbol = symbol
}

function Deck(){
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {
  // YOUR CODE HERE
  this.deck = new Array(52)
  var suits = ['spades','hearts','diamonds','clubs']
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < 13; j++) {
      var sym
      switch(j) {
        case 1: sym=[11,'A']
          break
        case 13: sym=[10,'K']
          break
        case 12: sym=[10,'Q']
          break
        case 11: sym=[10,'J']
          break
        default: sym=[j,j+'']
      }
      if (j===1)
        this.deck.push(suits[i],sym[0],sym[1])
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  this.deck = _.shuffle(this.deck)
}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
  return _.reduce(hand, function(memo, card) {return memo+card.val},0)
}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
  this.playerHand = []
  this.dealerHand = []
  for (var i = 0; i < 4; i++) {
    if (i%2===0) {this.playerHand.concat([this.deck.pop()])}
    if (i%2===1) {this.dealerHand.concat([this.deck.pop()])}
  }
  this.playerScore = this.calcValue(this.playerHand)
  this.dealerScore = this.calcValue(this.dealerHand)
  this.playerStatus = 'current'
  this.dealerStatus = 'waiting'
  this.status = 'in progress'
};

GameSchema.methods.hit = function(){
  // YOUR CODE HERE
  this.playerHand.concat([this.deck.pop()])
  this.playerScore = this.calcValue(this.playerHand)
  if (this.playerScore>21) {
    this.playerStatus = 'bust'
    this.gameOver()
  }
};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
  this.playerStatus = 'waiting'
  this.dealerStatus = 'current'
  while (this.dealerScore<=17) {
    this.dealerHand.concat([this.deck.pop()])
    this.dealerScore = this.calcValue(this.dealerHand)
  }
  if (this.dealerScore>21) {this.dealerStatus = 'bust'}
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
  if (this.playerStatus==='bust' || this.dealerScore>this.playerScore) 
    {this.dealerStatus = 'win'}
  else if (this.dealerStatus==='bust' || this.playerScore>this.dealerScore) 
    {this.playerStatus = 'win'}
  else {
    this.dealInitial() // push!
    return
  }
  this.status = 'over'
}

module.exports = mongoose.model('Game', GameSchema);