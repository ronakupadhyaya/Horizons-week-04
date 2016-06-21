var mongoose = require('mongoose');
mongoose.connect(require('./config'))

var GameSchema = new mongoose.Schema({
  bet: {
    type: Number,
    required: true
  },
  playerHand: [],

  dealerHand: [],

  deckCards: [],

  playerValue: {
    type: Number,
    default: 0,
    required: true
  },
  dealerValue: {
    type: Number,
    default: 0,
    required: true
  },
  gameStatus: {
    type: String,
    default: 'not started',
    required: true
  },
  playerStatus: {
    type: String,
    required: true
  },
  dealerStatus: {
    type: String,
    required: true
  }
});

GameSchema.statics.newGame = function(item, callback) {
  var game = new this(item)
  game.deck = new Deck();
  game.save(callback);
}

function Card(suit, val, symbol) {
  this.suit = suit,
  this.val = val,
  this.symbol = symbol
}

function Deck() {
  this.deck = [];
  this.createDeck()
  this.shuffleDeck()
  return this.deck;
}

Deck.prototype.createDeck = function() {

  var suitArray = ['hearts', 'diamonds', 'clubs', 'spades'];
  var symbolArray = ['A', 'K', 'Q', 'J'];

  // add number cards to deck
  for (var i = 2; i < 11; i++) {
    for (var j = 0; j < suitArray.length; j++) {
      this.deck.push(Card(suitArray[j], i, i));
    }
  }

  // add picture cards to deck
  for (var j = 0; j < suitArray.length; j++) {
    for (var k = 0; k < symbolArray.length; k++) {
      if (k === 0) {
        this.deck.push(Card(suitArray[j], 'A', 11));
      }
      else {
      this.deck.push(Card(suitArray[j], symbolArray[k], 10));
      }
    }
  }
}  
        

Deck.prototype.shuffleDeck = function() {
  
  // Looked up Fisher-Yates algorithm for card shuffling
  for (var i = this.deck.length - 1; i > 0; i--) {
    var n = Math.floor(Math.random() * i);
    var a = this.deck[n];
    this.deck[n] = this.deck[i];
    this.deck[i] = a;
  }
}

GameSchema.methods.calcValue = function(hand) {
  // calculate both player and dealer hand values
  var handValue = 0;
  for (var i = 0; i < hand.length; i++) {
    if (hand[i].val === 11) {
      if (handValue <= 10) {
        handValue += 11;
      }
      else {
        handValue == 1;
      }
    }
    else {
    handValue += hand[i].val;
    }
  }
}

GameSchema.methods.dealInitial = function() {

  this.deckCards = new Deck();

  // add 2 cards from the deck to the player's hand and 2 cards to the dealer's hand
  for (var i = 0; i < 2; i++) {
    this.playerHand += this.deckCards[this.deckCards.length];
    this.deckCards.pop();
    this.dealerHand += this.deckCards[this.deckCards.length];
    this.deckCards.pop();
  }

  // calculate the player's starting value and dealer's starting value
  this.playerValue = this.calcValue(this.playerHand);
  this.dealerValue = this.calcValue(this.dealerHand);

  // update the game status
  this.gameStatus = 'first deal';
};

GameSchema.methods.hit = function(){
  
  // add card to player's hand
  this.playerHand += this.deckCards[this.deckCards.length];
  this.deckCards.pop();

  // calculate player's value
  this.playerValue = this.calcValue(this.playerHand);
 
  //  check if player value exceeds 21 or is equal to 21
  if (this.playerValue > 21) {
    this.gameStatus = 'game over, player loses';
  }
  else if (this.playerValue === 21) { 
    if (this.dealerValue === 21) {
      // player gets bets back
    }
    else {
      // player wins
      this.gameStatus = 'game over, player wins';
    }
  }
};

GameSchema.methods.stand = function(){
  
  this.dealerHand += this.deckCards[this.deckCards.length];
  this.deckCards.pop();

  this.dealerValue = this.calcValue(this.dealerHand);

  // call the function again (recursive)
  this.stand();
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
}

module.exports = mongoose.model('Game', GameSchema);