var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  // YOUR CODE HERE
  playerBet: Number,
  cardsInPlayerHand: Array,
  cardsInDealerHand: Array,
  cardsInDeck: Array,
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
    default: 'Not Started',
    enum: ['Not Started', 'Over', 'In Progress']
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
  // YOUR CODE HERE
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
  // YOUR CODE HERE
  var suits = ['hearts', 'diamonds', 'spades', 'clubs'];
  var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
  for (var i = 0; i < suits.length; i++) {
    for (var j = 0; j < values.length; j++) {
      var suit = suits[i];
      var value = j + 2;
      if (j > 8 && values[j] !== 'A') {
        value = 10;
      } else if (values[j] === 'A') {
        value = 11;
      }
      var symbol = '' + values[j];
      this.deck.push(new Card(suit, value, symbol));
    }
  }
}

Deck.prototype.shuffleDeck = function() {
  // YOUR CODE HERE
  var newArr = [];
  while (newArr.length < 52) {
    var index = Math.floor(Math.random() * this.deck.length);
    newArr.push(this.deck[index]);
    this.deck.splice(index, 1);
  }
  this.deck = newArr;
}

GameSchema.methods.calcValue = function(hand){
  // YOUR CODE HERE
  var total = 0;
  var ace = false;
  for (var i = 0; i < hand.length; i++) {
    var card = hand[i];
    if (card.symbol === 'A') {
      ace = true;
    }
  }
  if (ace && total > 21) {
    total = total - 11 + 1;
  }
  return total;
}

GameSchema.methods.dealInitial = function() {
  // YOUR CODE HERE
  var playerHand = [];
  var dealerHand = [];
  var deck = new Deck();
  for (var i = 0; i < 4; i++) {
    if (i <= 1) {
      playerHand.push(deck.pop());
    } else {
      dealerHand.push(deck.pop());
    }
  }
  this.gameStatus = 'In Progress';
  this.cardsInPlayerHand = playerHand;
  this.cardsInDealerHand = dealerHand;
  this.playerTotal = this.methods.calcValue(playerHand);
  this.dealerTotal = this.methods.calcValue(dealerHand);
};

GameSchema.methods.hit = function(){
  // YOUR CODE HERE
  var card = this.cardsInDeck.pop();
  this.cardsInPlayerHand.push(card);
  this.playerTotal = this.methods.calcValue(this.cardsInPlayerHand);
  if (this.playerTotal > 21) {
    this.methods.gameOver();
  }
};

GameSchema.methods.stand = function(){
  // YOUR CODE HERE
  while (true) {
    this.cardsInDealerHand.push(this.cardsInDeck.pop());
    this.dealerTotal = this.methods.calcValue(this.cardsInDealerHand);
    if (this.dealerTotal > 17) {
      break;
    }
  }
  this.methods.gameOver();
}

GameSchema.methods.gameOver = function(){
  // YOUR CODE HERE
  this.gameStatus = 'Over';
  if (this.dealerTotal > 21) {
    this.dealerStatus = 'lose';
    this.playerStatus = 'win';
  } else if (this.playerTotal > 21) {
    this.dealerStatus = 'win';
    this.playerStatus = 'lose';
  }, 
}

module.exports = mongoose.model('Game', GameSchema);
